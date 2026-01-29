import axios from "axios";
import aqiCache from "../utils/aqiCache.js";
import { geocodeCity } from "../utils/geocodeCity.js";
import { getAQIByCoords } from "../utils/getAQI.js";
import { reverseGeocode } from "../utils/reverseGeocode.js";

/* 🔹 Sampling density */
const getSamplingStep = (distanceKm) => {
  if (distanceKm > 50) return 80;
  return 25;
};

/* 🔹 Sample route points */
const sampleRoutePoints = (geometry, step) => {
  const points = [];
  for (let i = 0; i < geometry.length; i += step) {
    points.push(geometry[i]);
  }
  return points;
};

/* 🔹 AQI → Zone */
const getZone = (aqi) => {
  if (aqi === null) return "Unknown";
  if (aqi > 200) return "High";
  if (aqi > 100) return "Medium";
  return "Low";
};

/* 🔹 Speed → Traffic */
const getTrafficLevel = (speedKmph) => {
  if (speedKmph < 15) return "Heavy";
  if (speedKmph < 30) return "Moderate";
  return "Light";
};

export const routeController = async (req, res) => {
  try {
    const { originCity, destinationCity } = req.body;

    if (!originCity || !destinationCity) {
      return res.status(400).json({
        success: false,
        message: "originCity and destinationCity required",
      });
    }

    /* 🔥 CACHE */
    const routeCacheKey = `route:${originCity}:${destinationCity}`;
    const cached = aqiCache.get(routeCacheKey);
    if (cached) return res.json(cached);

    /* 🌍 Geocode */
    const origin = await geocodeCity(originCity);
    const destination = await geocodeCity(destinationCity);

    /* 🛣️ OSRM */
    const osrmURL = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson&alternatives=true`;

    const osrmRes = await axios.get(osrmURL, { timeout: 15000 });

    const routes = [];

    for (let i = 0; i < osrmRes.data.routes.length; i++) {
      const r = osrmRes.data.routes[i];

      const distanceKm = r.distance / 1000;
      const durationMin = r.duration / 60;

      /* 🚦 Traffic */
      const avgSpeed = distanceKm / (r.duration / 3600);
      const traffic = getTrafficLevel(avgSpeed);

      const step = getSamplingStep(distanceKm);

      const geometry = r.geometry.coordinates.map(([lon, lat]) => ({
        lat,
        lon,
      }));

      const sampledPoints = sampleRoutePoints(geometry, step);

      /* 🌫️ AQI + 📍 AREA (FIXED) */
      const pollutionSegments = await Promise.all(
        sampledPoints.map(async (p) => {
          /* AQI */
          const aqiKey = `aqi:${p.lat},${p.lon}`;
          let aqi = aqiCache.get(aqiKey);

          if (aqi === undefined) {
            try {
              const res = await getAQIByCoords(p.lat, p.lon);
              aqi = res?.aqi ?? null;
              aqiCache.set(aqiKey, aqi);
            } catch {
              aqi = null;
            }
          }

          /* 📍 AREA — ALWAYS TRY */
          let area = "Along Route";
          const revKey = `rev:${p.lat},${p.lon}`;
          const cachedArea = aqiCache.get(revKey);

          if (cachedArea) {
            area = cachedArea;
          } else {
            try {
              area = await reverseGeocode(p.lat, p.lon);
              aqiCache.set(revKey, area);
            } catch {
              area = "Along Route";
            }
          }

          return {
            lat: p.lat,
            lon: p.lon,
            aqi,
            zone: getZone(aqi),
            area,
          };
        })
      );

      /* 📊 Average AQI */
      const validAQI = pollutionSegments
        .map((p) => p.aqi)
        .filter((a) => a !== null);

      const avgAQI = validAQI.length
        ? Math.round(validAQI.reduce((a, b) => a + b, 0) / validAQI.length)
        : null;

      routes.push({
        id: i,
        name: `Route ${i + 1}`,
        distance: `${distanceKm.toFixed(1)} km`,
        duration: `${Math.round(durationMin)} min`,
        avgAQI,
        traffic,
        avgSpeed: avgSpeed.toFixed(1),
        pollutionSegments,
        geometry,
      });
    }

    const response = {
      success: true,
      origin,
      destination,
      routes,
    };

    aqiCache.set(routeCacheKey, response);
    res.json(response);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
