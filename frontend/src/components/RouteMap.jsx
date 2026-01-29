import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ===== ICONS ===== */
const redIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
});

const blueIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
  iconSize: [32, 32],
});

/* ===== HELPERS ===== */
const getAQIColor = (aqi) => {
  if (aqi === null) return "#9CA3AF";
  if (aqi <= 120) return "#22C55E";
  if (aqi <= 160) return "#FACC15";
  if (aqi <= 200) return "#FB923C";
  return "#EF4444";
};

const shouldWarnCloseGlass = (aqi) => {
  return aqi !== null && aqi >= 150;
};

const getLabelCount = (distanceKm) => {
  if (distanceKm < 50) return 3;
  if (distanceKm < 150) return 4;
  return 5;
};

/* ===== AUTO FIT MAP ===== */
const FitBounds = ({ origin, destination }) => {
  const map = useMap();

  useEffect(() => {
    if (!origin || !destination) return;

    const bounds = L.latLngBounds(
      [origin.lat, origin.lon],
      [destination.lat, destination.lon],
    );

    map.fitBounds(bounds, { padding: [30, 30] });
  }, [map, origin, destination]);

  return null;
};

/* ===== MAIN MAP ===== */
const RouteMap = ({ routes, selectedRouteId, origin, destination }) => {
  if (!origin || !destination) return null;

  const originPos = [origin.lat, origin.lon];
  const destPos = [destination.lat, destination.lon];

  const selectedRoute = routes.find((r) => r.id === selectedRouteId);
  const labelIndexes = new Set();

  if (selectedRoute?.pollutionSegments?.length) {
    const total = selectedRoute.pollutionSegments.length;
    const distanceKm = parseFloat(selectedRoute.distance);
    const labelsToShow = getLabelCount(distanceKm);

    for (let i = 0; i < labelsToShow; i++) {
      const index = Math.floor((i * total) / labelsToShow);
      labelIndexes.add(index);
    }
  }

  return (
    <MapContainer
      center={originPos}
      zoom={6}
      className="h-[500px] w-full"
      style={{ background: "#0a1f15" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

      <FitBounds origin={origin} destination={destination} />

      {/* Origin */}
      <Marker position={originPos} icon={redIcon}>
        <Popup>
          <strong className="text-emerald-500">Origin:</strong> {origin.name}
        </Popup>
      </Marker>

      {/* Destination */}
      <Marker position={destPos} icon={blueIcon}>
        <Popup>
          <strong className="text-blue-500">Destination:</strong>{" "}
          {destination.name}
        </Popup>
      </Marker>

      {routes.map((route) => {
        const isSelected = route.id === selectedRouteId;

        if (isSelected && route.pollutionSegments?.length > 1) {
          return route.pollutionSegments.map((seg, i) => {
            if (i === route.pollutionSegments.length - 1) return null;

            const segColor = getAQIColor(seg.aqi);
            const showWarning = shouldWarnCloseGlass(seg.aqi);

            return (
              <>
                {/* 🔥 AQI SEGMENT */}
                <Polyline
                  key={`${route.id}-seg-${i}`}
                  positions={[
                    [seg.lat, seg.lon],
                    [
                      route.pollutionSegments[i + 1].lat,
                      route.pollutionSegments[i + 1].lon,
                    ],
                  ]}
                  pathOptions={{
                    color: segColor,
                    weight: seg.aqi <= 120 ? 9 : 6,
                    opacity: 1,
                  }}
                >
                  {labelIndexes.has(i) && (
                    <Tooltip
                      permanent
                      direction="top"
                      opacity={1}
                      className="leaflet-tooltip-custom"
                    >
                      <div
                        style={{
                          background: "rgba(10,31,21,0.95)",
                          color: "#ffffff", // ✅ FIX
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: `2px solid ${segColor}`,
                          boxShadow: `0 4px 20px ${segColor}40`,
                          fontSize: "13px",
                          fontWeight: 600,
                          zIndex: 9999, // ✅ FIX
                        }}
                      >
                        <div style={{ color: segColor }}>
                          {seg.zone || "Unknown"}
                        </div>
                        <div>AQI: {seg.aqi ?? "N/A"}</div>
                      </div>
                    </Tooltip>
                  )}
                </Polyline>

                {/* 🚗⚠️ POLLUTION WARNING */}
                {showWarning && (
                  <Marker
                    position={[seg.lat, seg.lon]}
                    icon={L.divIcon({
                      className: "",
                      html: "🚗⚠️",
                      iconSize: [24, 24],
                    })}
                  >
                    <Popup>
                      <div className="text-sm font-medium text-red-500">
                        🚨 High Pollution Area
                        <br />
                        <span className="text-white">
                          Please close car windows
                        </span>
                        <br />
                        AQI: {seg.aqi}
                      </div>
                    </Popup>
                  </Marker>
                )}
              </>
            );
          });
        }

        /* Non-selected routes */
        const positions = route.geometry?.map((p) => [p.lat, p.lon]) || [];

        return (
          <Polyline
            key={route.id}
            positions={positions}
            pathOptions={{
              color: "#4b5563",
              weight: 4,
              opacity: 0.4,
            }}
          />
        );
      })}
    </MapContainer>
  );
};

export default RouteMap;
