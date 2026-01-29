import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  BatteryCharging,
  Bike,
  Building2,
  Car,
  CheckCircle2,
  Droplets,
  Factory,
  HardHat,
  Leaf,
  Lightbulb,
  MapPin,
  Recycle,
  Sun,
  Target,
  Train,
  TrendingDown,
  Users,
  Wind,
  Zap,
} from "lucide-react";
import { getCityPollution } from "@/services/pollutionApi";
import { getCurrentCity } from "@/utils/getCurrentCity";
import { getAQIColorClass } from "@/utils/aqiColor";
import { sectorColorMap } from "@/utils/sectorColors";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { validateCity } from "@/utils/validateCity";
import { cityAutocomplete } from "@/utils/cityAutocomplete";

const pollutionSectors = [
  {
    key: "transport",
    label: "Transport & Vehicles",
    icon: <Car style={{ width: 32, height: 32 }} />,
    color: "#F97316",
    bgColor: "rgba(249, 115, 22, 0.15)",
    //   percentage: currentState.transport,
    description:
      "Emissions from cars, trucks, buses, and two-wheelers burning fossil fuels.",
    detailedSolutions: [
      {
        title: "Switch to Electric Vehicles",
        icon: <BatteryCharging style={{ width: 24, height: 24 }} />,
        points: [
          "Government subsidies up to ₹1.5 lakh on EVs under FAME-II scheme",
          "Lower running cost: ₹1/km vs ₹5/km for petrol vehicles",
          "Zero tailpipe emissions reducing PM2.5 by up to 90%",
          "Growing charging infrastructure with 10,000+ stations across India",
          "Tax benefits: Road tax exemption in many states",
        ],
      },
      {
        title: "Use Public Transport",
        icon: <Train style={{ width: 24, height: 24 }} />,
        points: [
          "Metro reduces per-person emissions by 80% compared to cars",
          "Delhi Metro saves 5.7 lakh tonnes of CO2 annually",
          "Monthly metro pass: ₹2,250 vs ₹15,000 for car fuel",
          "Dedicated bus lanes reduce travel time by 30%",
          "App-based tracking for better trip planning",
        ],
      },
      {
        title: "Adopt Active Mobility",
        icon: <Bike style={{ width: 24, height: 24 }} />,
        points: [
          "Cycling for trips under 5km reduces emissions to zero",
          "Public bike-sharing systems in 50+ Indian cities",
          "Health benefits: 30 mins cycling burns 300 calories",
          "Dedicated cycling tracks being built in major cities",
          "E-bikes available for longer commutes",
        ],
      },
    ],
  },
  {
    key: "industry",
    label: "Industrial Emissions",
    icon: <Factory style={{ width: 32, height: 32 }} />,
    color: "#8B5CF6",
    bgColor: "rgba(139, 92, 246, 0.15)",
    //   percentage: currentState.industry,
    description:
      "Pollution from manufacturing, refineries, and industrial processes.",
    detailedSolutions: [
      {
        title: "Clean Production Technologies",
        icon: <Recycle style={{ width: 24, height: 24 }} />,
        points: [
          "Install electrostatic precipitators (99% dust removal)",
          "Switch to natural gas from coal (50% less emissions)",
          "Implement closed-loop water systems",
          "Use bag filters for particulate matter control",
          "Regular maintenance reduces emissions by 30%",
        ],
      },
      {
        title: "Green Certifications",
        icon: <Leaf style={{ width: 24, height: 24 }} />,
        points: [
          "IGBC Green Factory certification reduces energy by 40%",
          "ISO 14001 environmental management standards",
          "Zero liquid discharge (ZLD) systems mandatory",
          "Carbon footprint reporting and offsetting",
          "Green building materials in factory construction",
        ],
      },
      {
        title: "Renewable Energy Adoption",
        icon: <Sun style={{ width: 24, height: 24 }} />,
        points: [
          "Rooftop solar can meet 30-50% of factory power needs",
          "Power purchase agreements for wind energy",
          "Green hydrogen for high-heat industrial processes",
          "Battery storage for consistent renewable power",
          "Net metering allows selling excess power",
        ],
      },
    ],
  },
  {
    key: "power",
    label: "Power Generation",
    icon: <Zap style={{ width: 32, height: 32 }} />,
    color: "#EAB308",
    bgColor: "rgba(234, 179, 8, 0.15)",
    //   percentage: currentState.power,
    description:
      "Emissions from coal-fired power plants and electricity generation.",
    detailedSolutions: [
      {
        title: "Solar Power Revolution",
        icon: <Sun style={{ width: 24, height: 24 }} />,
        points: [
          "Rooftop solar: ₹3-4/unit vs ₹8/unit from grid",
          "PM-KUSUM scheme: 60% subsidy for solar pumps",
          "Net metering: Earn from excess power generation",
          "25-year lifespan with minimal maintenance",
          "Payback period: 4-5 years for residential",
        ],
      },
      {
        title: "Wind Energy",
        icon: <Wind style={{ width: 24, height: 24 }} />,
        points: [
          "India's wind capacity: 42 GW and growing",
          "Offshore wind potential of 70 GW",
          "Community wind projects for rural areas",
          "Hybrid wind-solar parks for consistent power",
          "Green bonds available for project financing",
        ],
      },
      {
        title: "Energy Efficiency",
        icon: <Lightbulb style={{ width: 24, height: 24 }} />,
        points: [
          "LED bulbs: 80% less energy than incandescent",
          "5-star appliances save ₹2,000-5,000/year",
          "Smart meters enable real-time monitoring",
          "AC at 24°C vs 18°C saves 25% energy",
          "Perform appliance energy audits",
        ],
      },
    ],
  },
  {
    key: "construction",
    label: "Construction & Dust",
    icon: <HardHat style={{ width: 32, height: 32 }} />,
    color: "#14B8A6",
    bgColor: "rgba(20, 184, 166, 0.15)",
    //   percentage: currentState.construction,
    description:
      "Dust from construction sites, road building, and demolition activities.",
    detailedSolutions: [
      {
        title: "Dust Suppression Systems",
        icon: <Droplets style={{ width: 24, height: 24 }} />,
        points: [
          "Anti-smog guns reduce dust by 80%",
          "Water sprinklers mandatory at all sites",
          "Covered trucks for material transport",
          "Wheel washing at site entry/exit points",
          "Wind barriers around construction perimeter",
        ],
      },
      {
        title: "Green Building Practices",
        icon: <Building2 style={{ width: 24, height: 24 }} />,
        points: [
          "Pre-fabricated construction reduces on-site dust",
          "Recycled materials: Fly ash bricks, recycled steel",
          "Green cement alternatives with 30% less emissions",
          "Modular construction reduces waste by 50%",
          "GRIHA/LEED certification for new buildings",
        ],
      },
      {
        title: "Site Management",
        icon: <Target style={{ width: 24, height: 24 }} />,
        points: [
          "Covered storage for sand and cement",
          "Scheduled work hours to reduce peak-time dust",
          "Real-time air quality monitoring at sites",
          "Worker training on dust control measures",
          "Penalties for non-compliance strictly enforced",
        ],
      },
    ],
  },
];

const PollutionSources = () => {
  const [inputCity, setInputCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const requestRef = useRef(0);
  const [suggestions, setSuggestions] = useState([]);

  const isLoading = loading || locLoading;

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputCity(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    const results = await cityAutocomplete(value);
    setSuggestions(results);
  };

  const fetchData = async (cityInput) => {
    if (!cityInput) return;
    const id = ++requestRef.current;

    try {
      setLoading(true);

      const validated = await validateCity(cityInput);

      if (!validated) {
        alert("❌ Invalid city name");
        setData(null); // ✅ CLEAR OLD RESULT
        return;
      }

      // ✅ NORMALIZED CITY
      setInputCity(validated.city);
      const res = await getCityPollution(validated.city);
      if (id !== requestRef.current) return;
      setData(res);
    } finally {
      if (id === requestRef.current) setLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      setLocLoading(true);
      const city = await getCurrentCity();
      setInputCity(city);
      fetchData(city);
    } finally {
      setLocLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1210] to-[#060908] text-[#f0f5f2]">
      <Navbar />

      {/* HERO */}
      <section className="pt-[110px] pb-[60px] text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
          <Factory className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-red-500">
            Pollution Analysis
          </span>
        </div>

        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-4">
          Understanding{" "}
          <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Pollution Sources
          </span>
        </h1>
      </section>

      {/* SEARCH */}
      <div className="max-w-[1280px] mx-auto px-4 mb-12">
        <div className="bg-[#0f1917]/80 border border-white/10 rounded-2xl p-4 flex flex-wrap gap-3 backdrop-blur-xl">
          <input
            value={inputCity}
            onChange={handleInputChange}
            placeholder="Enter city"
            className="flex-1 px-4 py-2 rounded-lg bg-[#0f1917] border border-gray-600 outline-none"
          />

          {suggestions.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-[#0f1917] border border-gray-700 rounded-lg z-50 max-h-60 overflow-auto">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setInputCity(s.city);
                    setSuggestions([]);
                    fetchData(s.city);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-green-500/10"
                >
                  {s.label}
                </div>
              ))}
            </div>
          )}

          <button
            disabled={isLoading}
            onClick={() => fetchData(inputCity)}
            className="px-6 py-2 rounded-lg bg-green-500 text-black font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
            )}
            Search
          </button>

          <button
            disabled={isLoading}
            onClick={handleUseCurrentLocation}
            className="px-6 py-2 rounded-lg bg-blue-500 text-black font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {locLoading && (
              <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
            )}
            Use Current Location
          </button>
        </div>
      </div>

      {/* 🌿 BEAUTIFUL LOADER */}
      {isLoading && (
        <div className="flex justify-center items-center py-24">
          <div className="relative bg-[#0f1917]/80 border border-white/10 rounded-3xl px-14 py-12 backdrop-blur-xl shadow-[0_0_80px_rgba(34,197,94,0.25)]">
            {/* Spinner */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-green-500/30" />
              <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
              <div className="absolute inset-3 rounded-full bg-green-500/30 animate-pulse" />
            </div>

            <p className="text-center text-green-400 font-semibold text-lg">
              Fetching pollution data
            </p>
            <p className="text-center text-gray-400 text-sm mt-1">
              Please wait a moment…
            </p>
          </div>
        </div>
      )}

      {/* RESULT */}
      {!isLoading && data && (
        <div>
          <div className="max-w-[1280px] mx-auto px-4 pb-24">
            <div className="bg-[#0f1917]/80 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl shadow-[0_0_120px_rgba(34,197,94,0.08)]">
              {/* TOP */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{data.city}</h2>
                    <p className="text-sm text-gray-400">
                      Lat {data.coordinates.lat.toFixed(4)} • Lon{" "}
                      {data.coordinates.lon.toFixed(4)}
                    </p>
                  </div>
                </div>

                <div
                  className={`px-8 py-6 rounded-2xl text-center font-semibold ${getAQIColorClass(
                    data.aqi
                  )}`}
                >
                  <p className="text-xs uppercase opacity-80">Current AQI</p>
                  <p className="text-4xl font-bold">{data.aqi}</p>
                  <p className="text-sm">Very Unhealthy</p>
                </div>
              </div>

              {/* SECTORS */}
              <h3 className="text-gray-400 uppercase tracking-widest mb-6">
                Pollution Contribution by Sector
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {Object.entries(data.contribution).map(([key, value]) => {
                  const colors = sectorColorMap[key];
                  return (
                    <div
                      key={key}
                      className={`rounded-2xl p-5 border border-white/10 ${colors.bg}`}
                    >
                      <div className="flex justify-between mb-3">
                        <span className={`${colors.text} capitalize`}>
                          {key}
                        </span>
                        <span className={`text-3xl font-bold ${colors.text}`}>
                          {value}%
                        </span>
                      </div>

                      <div className="w-full h-2 bg-black/40 rounded mb-3">
                        <div
                          className={`h-2 rounded ${colors.bar}`}
                          style={{ width: `${value}%` }}
                        />
                      </div>

                      <p className="text-sm text-gray-400">
                        {data.detectedSources?.[key] ?? 0} detected sources
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <section className="py-[40px] pb-[80px]">
              <div className="max-w-[1280px] mx-auto px-4">
                {/* Heading */}
                <div className="text-center mb-16">
                  <h2 className="font-['Space_Grotesk'] text-[clamp(1.5rem,4vw,2.5rem)] font-bold mb-4">
                    How to{" "}
                    <span className="bg-gradient-to-br from-[#22C55E] via-[#14B8A6] to-[#3B82F6] bg-clip-text text-transparent">
                      Reduce Pollution
                    </span>
                  </h2>
                  <p className="text-[#6b7c75] max-w-[600px] mx-auto">
                    Comprehensive solutions for each pollution source — from
                    individual actions to systemic changes.
                  </p>
                </div>

                {/* Sectors */}
                {pollutionSectors.map((sector, sectorIndex) => (
                  <div
                    key={sector.key}
                    className="mb-12 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                    style={{ animationDelay: `${sectorIndex * 0.1}s` }}
                  >
                    {/* Sector Header */}
                    <div
                      className="flex items-center gap-4 mb-6 p-6 rounded-2xl border"
                      style={{
                        background: sector.bgColor,
                        borderColor: `${sector.color}40`,
                      }}
                    >
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{
                          background: `${sector.color}30`,
                          color: sector.color,
                        }}
                      >
                        {sector.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#f0f5f2]">
                            {sector.label}
                          </h3>
                          <span
                            className="px-3 py-1 rounded-lg text-sm font-semibold"
                            style={{
                              background: `${sector.color}30`,
                              color: sector.color,
                            }}
                          >
                            {data.contribution?.[sector.key] ?? 0}% of pollution
                          </span>
                        </div>
                        <p className="text-sm text-[#9CA3AF]">
                          {sector.description}
                        </p>
                      </div>

                      <TrendingDown className="w-8 h-8 text-[#22C55E]" />
                    </div>

                    {/* Solutions Grid */}
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6">
                      {sector.detailedSolutions.map((solution, index) => (
                        <div
                          key={solution.title}
                          className="p-7 rounded-2xl bg-[rgba(15,25,23,0.8)] border border-[rgba(37,58,52,0.5)] backdrop-blur-[20px]
                         transition-all duration-300 hover:-translate-y-1"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = `${sector.color}50`;
                            e.currentTarget.style.boxShadow = `0 20px 40px ${sector.color}15`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor =
                              "rgba(37,58,52,0.5)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <div className="flex items-center gap-3 mb-5">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{
                                background: `${sector.color}20`,
                                color: sector.color,
                              }}
                            >
                              {solution.icon}
                            </div>
                            <h4 className="font-['Space_Grotesk'] text-lg font-semibold text-[#f0f5f2]">
                              {solution.title}
                            </h4>
                          </div>

                          <ul className="space-y-2">
                            {solution.points.map((point, i) => (
                              <li
                                key={i}
                                className={`flex items-start gap-3 py-2 ${
                                  i < solution.points.length - 1
                                    ? "border-b border-[rgba(37,58,52,0.3)]"
                                    : ""
                                }`}
                              >
                                <CheckCircle2 className="w-[18px] h-[18px] text-[#22C55E] mt-[2px] shrink-0" />
                                <span className="text-sm text-[#d1d5db] leading-relaxed">
                                  {point}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="py-[60px] pb-[80px]">
              <div className="max-w-[1280px] mx-auto px-4">
                <div
                  className="p-12 rounded-3xl text-center border border-[#22C55E33]
      bg-gradient-to-br from-[rgba(34,197,94,0.1)] to-[rgba(20,184,166,0.1)]"
                >
                  <Users className="w-12 h-12 text-[#22C55E] mx-auto mb-6" />

                  <h2 className="font-['Space_Grotesk'] text-[clamp(1.5rem,3vw,2rem)] font-bold mb-4">
                    Every Action Counts
                  </h2>

                  <p className="text-[#6b7c75] max-w-[600px] mx-auto mb-8 text-base">
                    Join thousands of citizens making sustainable choices. Track
                    your impact, earn rewards, and contribute to cleaner air for
                    everyone.
                  </p>

                  <div className="flex gap-4 justify-center flex-wrap">
                    <Link to="/dashboard">
                      <button
                        className="flex items-center gap-2 px-8 py-4 font-semibold rounded-xl text-[#080d0b]
                       bg-gradient-to-br from-[#22C55E] to-[#14B8A6]
                       shadow-[0_0_30px_rgba(34,197,94,0.4)]
                       transition-all duration-300 hover:-translate-y-0.5
                       hover:shadow-[0_0_50px_rgba(34,197,94,0.6)]"
                      >
                        Get Your Score
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </Link>

                    <Link to="/">
                      <button
                        className="px-8 py-4 font-semibold rounded-xl text-[#d1d5db]
                       bg-[rgba(15,25,23,0.8)]
                       border border-[rgba(37,58,52,0.5)]
                       transition-colors duration-300
                       hover:border-[#22C55E4D]"
                      >
                        Back to Home
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PollutionSources;
