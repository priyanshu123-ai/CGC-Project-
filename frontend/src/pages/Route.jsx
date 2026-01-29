import { useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import RouteMap from "@/components/RouteMap";
import AQIBadge from "../components/AQIBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Navigation,
  Search,
  Clock,
  Route as RouteIcon,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { serverUrl } from "@/main";
import { getCachedRoute, setCachedRoute } from "@/utils/routeCache";

/* AQI color helper */
const getAQIColor = (aqi) => {
  if (aqi === null) return "#9CA3AF";
  if (aqi <= 50) return "#22C55E";
  if (aqi <= 100) return "#FACC15";
  if (aqi <= 150) return "#FB923C";
  if (aqi <= 200) return "#EF4444";
  return "#991B1B";
};

const Routes = () => {
  const [origin, setOrigin] = useState("Delhi");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!destination) return;
    setLoading(true);

    try {
      /* 1️⃣ Try frontend cache */
      const cached = getCachedRoute(origin, destination);

      if (cached) {
        setRoutes(cached.routes || []);
        setSelectedRoute(cached.routes?.[0]?.id || 0);
        setOriginCoords(cached.origin);
        setDestinationCoords(cached.destination);
        return;
      }

      /* 2️⃣ Call backend */
      const res = await axios.post(`${serverUrl}/api/v2/routes`, {
        originCity: origin,
        destinationCity: destination,
      });

      /* 3️⃣ Save to frontend cache */
      setCachedRoute(origin, destination, res.data);

      setRoutes(res.data.routes || []);
      setSelectedRoute(res.data.routes?.[0]?.id || 0);
      setOriginCoords(res.data.origin);
      setDestinationCoords(res.data.destination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0f0d" }}>
      <Navbar />

      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-emerald-400">AQI-Aware</span>{" "}
            <span className="text-white">Route Planner</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Find the cleanest route to your destination
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <Card className="border-0 bg-[rgba(15,25,23,0.9)]">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                    <Input
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="From city"
                      className="pl-10 bg-transparent border-emerald-500/30 text-white"
                    />
                  </div>

                  <div className="relative flex-1">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                    <Input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="To city"
                      className="pl-10 bg-transparent border-emerald-500/30 text-white"
                    />
                  </div>

                  <Button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-emerald-500 hover:bg-emerald-600 px-8"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Finding…
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Find Routes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="border-0 bg-[rgba(15,25,23,0.9)]">
              <CardContent className="p-4">
                {routes.length > 0 && originCoords && destinationCoords ? (
                  <RouteMap
                    routes={routes}
                    selectedRouteId={selectedRoute}
                    origin={originCoords}
                    destination={destinationCoords}
                  />
                ) : (
                  <div className="h-[450px] flex items-center justify-center border-2 border-dashed border-emerald-500/20">
                    <RouteIcon className="w-16 h-16 text-emerald-500/30" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Available Routes
            </h2>

            {routes.map((route) => (
              <Card
                key={route.id}
                onClick={() => setSelectedRoute(route.id)}
                className={`cursor-pointer border-2 ${
                  selectedRoute === route.id
                    ? "border-emerald-500"
                    : "border-transparent"
                } bg-[rgba(15,25,23,0.9)]`}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between mb-3">
                    <h3 className="text-white font-semibold">{route.name}</h3>
                    <AQIBadge value={route.avgAQI} size="sm" />
                  </div>

                  <div className="flex gap-4 text-gray-400 text-sm mb-3">
                    <span className="flex gap-1">
                      <Clock className="w-4 h-4" />
                      {route.duration}
                    </span>
                    <span className="flex gap-1">
                      <RouteIcon className="w-4 h-4" />
                      {route.distance}
                    </span>
                  </div>

                  {/* AQI bar */}
                  <div className="flex gap-1 mb-3">
                    {route.pollutionSegments?.slice(0, 6).map((s, i) => (
                      <div
                        key={i}
                        className="flex-1 h-2 rounded-full"
                        style={{
                          backgroundColor: getAQIColor(s.aqi),
                        }}
                      />
                    ))}
                  </div>

                  {route.avgAQI > 100 && (
                    <div className="flex gap-2 text-amber-400 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      Mask recommended
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pollution Table */}
        {/* {routes[selectedRoute]?.pollutionSegments && (
          <div className="mt-6 bg-black/30 p-4 rounded-lg">
            <h3 className="text-white mb-3 font-semibold">
              Pollution Zones Along Route
            </h3>

            <table className="w-full text-sm text-gray-300">
              <thead>
                <tr>
                  <th className="text-left">Segment</th>
                  <th>AQI</th>
                  <th>Zone</th>
                </tr>
              </thead>
            <tbody>
  {routes[selectedRoute].pollutionSegments.map((s, i) => (
    <tr key={i}>
      <td className="text-left">
        {s.area || `Segment ${i + 1}`}
      </td>
      <td>{s.aqi ?? "N/A"}</td>
      <td
        className={
          s.zone === "High"
            ? "text-red-400"
            : s.zone === "Medium"
            ? "text-yellow-400"
            : "text-green-400"
        }
      >
        {s.zone}
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        )} */}

        {routes[selectedRoute]?.pollutionSegments &&
          routes[selectedRoute]?.pollutionSegments.length > 0 && (
            <div className="mt-8 rounded-2xl border border-[rgba(16,185,129,0.2)] bg-[rgba(15,25,23,0.95)] p-6">
              {/* Header */}
              <h3 className="mb-6 text-xl font-semibold text-white">
                Pollution Zones Along Route (
                {routes[selectedRoute]?.pollutionSegments.length} segments)
              </h3>

              {/* Segments */}
              <div className="space-y-4">
                {routes[selectedRoute]?.pollutionSegments.map((s, i) => {
                  const zoneColor =
                    s.zone === "High"
                      ? "text-red-500"
                      : s.zone === "Medium"
                        ? "text-yellow-400"
                        : "text-green-400";

                  return (
                    <div
                      key={i}
                      className="flex flex-col gap-4 rounded-xl border border-white/5 bg-[rgba(17,34,30,0.9)] p-4 md:flex-row md:items-center md:justify-between"
                    >
                      {/* Left side */}
                      <div className="flex items-start gap-4">
                        <div className="text-sm text-gray-400">{i + 1}.</div>

                        <div>
                          <p className="font-medium text-white">
                            {s.area || s.name || `Segment ${i + 1}`}
                          </p>
                          <p className="text-sm text-gray-400">
                            Lat: {s.lat ? s.lat.toFixed(4) : "-"}, Lon:{" "}
                            {s.lon ? s.lon.toFixed(4) : "-"}
                          </p>
                        </div>
                      </div>

                      {/* Right side */}
                      <div className="flex items-center gap-4">
                        {/* AQI badge */}
                        <span
                          className="rounded-full px-3 py-1 text-sm font-semibold"
                          style={{
                            backgroundColor: getAQIColor(s.aqi),
                            color: s.aqi <= 100 ? "#000" : "#fff",
                          }}
                        >
                          AQI {s.aqi || "N/A"}
                        </span>

                        {/* Zone */}
                        <span className={`text-sm font-medium ${zoneColor}`}>
                          {s.zone || "-"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {/* Google Navigation */}
        {routes.length > 0 && (
          <div className="fixed bottom-8 right-6">
            <Button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`,
                  "_blank",
                )
              }
              className="bg-emerald-500 px-8 py-6 rounded-full shadow-lg"
            >
              <Navigation className="w-5 h-5 mr-2" />
              Start Navigation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Routes;
