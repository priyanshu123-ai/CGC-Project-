import { geocodeCity } from "../utils/geocodeCity.js";
import { detectPollutionSources } from "../utils/detectPollutionSources.js";
import { calculateSectorContribution } from "../utils/calculateSectorContribution.js";
import { getAQIByCoords } from "../utils/getAQI.js";

export const cityPollutionController = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City required",
      });
    }

    

    // 1️⃣ City → lat/lon
    const location = await geocodeCity(city);

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Invalid city",
      });
    }

    // 2️⃣ Real AQI (safe)
    let aqi = null;
    try {
      const aqiRes = await getAQIByCoords(location.lat, location.lon);
      aqi = aqiRes?.aqi ?? null;
    } catch (e) {
      console.warn("AQI fetch failed, continuing...");
    }

    // 3️⃣ ALWAYS CREATE A VALID BBOX
    const bbox = Array.isArray(location.bbox)
      ? location.bbox
      : [
          location.lat - 0.1, // south
          location.lat + 0.1, // north
          location.lon - 0.1, // west
          location.lon + 0.1, // east
        ];

    // 4️⃣ Detect pollution sources (safe)
    let sources = {
      transport: 0,
      industry: 0,
      power: 0,
      construction: 0,
    };

    try {
      sources = await detectPollutionSources(bbox);
    } catch (e) {
      console.warn("Overpass failed, continuing...");
    }

    // 5️⃣ Calculate sector contribution
    const contribution = calculateSectorContribution(sources);

    // 6️⃣ Response
    res.json({
      success: true,
      city,
      coordinates: location,
      aqi,
      contribution,
      detectedSources: sources,
    });
  } catch (err) {
    console.error("City pollution error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to calculate pollution contribution",
    });
  }
};