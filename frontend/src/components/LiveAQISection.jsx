import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Wind,
  Droplets,
  Thermometer,
  Shield,
  RefreshCw,
  ArrowRight,
  Factory,
} from "lucide-react";
import AQIBadge from "./AQIBadge";

const WAQI_TOKEN = import.meta.env.VITE_WAQI_TOKEN;
const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

const LiveAQISection = () => {
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [data, setData] = useState(null);

  /* ================= MASK LOGIC ================= */
  const getMaskRecommendation = (aqi) => {
    if (aqi <= 50) return { text: "No Mask Needed", icon: "😊" };
    if (aqi <= 100) return { text: "N95 Optional", icon: "😐" };
    if (aqi <= 150) return { text: "N95 Recommended", icon: "😷" };
    if (aqi <= 200) return { text: "N95 Required", icon: "😷" };
    return { text: "N99 / N100 Required", icon: "🤢" };
  };

  /* ================= FETCH LIVE DATA ================= */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          /* ================= REAL AQI (WAQI) ================= */
          const waqiRes = await fetch(
            `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${WAQI_TOKEN}`
          );
          const waqiJson = await waqiRes.json();

          const aqi =
            waqiJson.status === "ok" && waqiJson.data?.aqi
              ? waqiJson.data.aqi
              : 150;

          const city =
            waqiJson.status === "ok"
              ? waqiJson.data.city.name
              : "Unknown";

          /* ================= WEATHER ================= */
          const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_KEY}`
          );
          const weather = await weatherRes.json();

          setData({
            city,
            lat: latitude,
            lon: longitude,
            aqi,
            temperature: Math.round(weather.main.temp),
            humidity: weather.main.humidity,
            windSpeed: Math.round(weather.wind.speed),
          });

          setLastUpdated(new Date());
        } catch (err) {
          console.error("Live AQI error:", err);
        } finally {
          setLoading(false);
        }
      },
      () => setLoading(false)
    );
  }, []);

  /* ================= LOADER ================= */
  if (loading || !data) {
    return (
      <section className="py-24 flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin" />
          <p className="text-gray-400 text-sm">Fetching live AQI…</p>
        </div>
      </section>
    );
  }

  const mask = getMaskRecommendation(data.aqi);

  return (
    <section className="py-24 relative">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white">
            Current Air Quality in{" "}
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              {data.city}
            </span>
          </h2>

          <div className="mt-3 flex justify-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {data.lat.toFixed(4)}, {data.lon.toFixed(4)}
            </span>
            <span className="flex items-center gap-1">
              <RefreshCw size={14} /> {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-8">
          {/* AQI */}
          <div className="p-8 bg-[rgba(15,25,23,0.7)] border border-[rgba(37,58,52,0.5)] rounded-2xl text-center">
            <p className="text-xs uppercase text-gray-400 mb-3">
              Air Quality Index
            </p>
            <p className="text-6xl font-bold text-orange-400">
              {data.aqi}
            </p>
            <AQIBadge value={data.aqi} size="lg" />
          </div>

          {/* MASK */}
          <div className="p-8 bg-[rgba(15,25,23,0.7)] border border-[rgba(37,58,52,0.5)] rounded-2xl">
            <p className="text-xs uppercase text-gray-400 mb-4">
              Mask Recommendation
            </p>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-purple-500/20 flex items-center justify-center text-4xl">
                {mask.icon}
              </div>
              <div>
                <p className="text-xl font-semibold text-purple-400">
                  {mask.text}
                </p>
                <p className="text-sm text-gray-400">Based on AQI</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-3 rounded-xl">
              <Shield size={16} className="text-green-400" />
              <span className="text-sm text-gray-300">
                Outdoor activities: Avoid
              </span>
            </div>
          </div>

          {/* WEATHER */}
          <div className="p-8 bg-[rgba(15,25,23,0.7)] border border-[rgba(37,58,52,0.5)] rounded-2xl">
            <Stat icon={<Thermometer />} label="Temperature" value={`${data.temperature}°C`} />
            <Stat icon={<Droplets />} label="Humidity" value={`${data.humidity}%`} />
            <Stat icon={<Wind />} label="Wind Speed" value={`${data.windSpeed} km/h`} />
          </div>
        </div>

        {/* POLLUTION LINK */}
        <Link to="/pollution" className="block">
          <div className="flex items-center justify-between p-6 rounded-2xl border border-red-500/20 bg-red-500/10 hover:shadow-lg">
            <div className="flex items-center gap-4">
              <Factory className="w-7 h-7 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  View Pollution Sources & Solutions
                </h3>
                <p className="text-sm text-gray-400">
                  Learn what causes pollution and how to reduce it
                </p>
              </div>
            </div>
            <ArrowRight className="text-red-500" />
          </div>
        </Link>
      </div>
    </section>
  );
};

/* SMALL STAT */
const Stat = ({ icon, label, value }) => (
  <div className="flex justify-between items-center mb-4">
    <div className="flex items-center gap-3 text-gray-400">
      {icon}
      {label}
    </div>
    <span className="font-semibold text-white">{value}</span>
  </div>
);

export default LiveAQISection;
