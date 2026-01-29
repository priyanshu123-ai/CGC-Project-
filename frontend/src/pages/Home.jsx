import Navbar from "@/components/Navbar";
import { ChevronRight, Leaf } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer"
import LiveAQISection from "@/components/LiveAQISection";

const Home = () => {
  const navigation = useNavigate('')
  const keyframes = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 30px rgba(29, 185, 84, 0.3); }
      50% { box-shadow: 0 0 60px rgba(29, 185, 84, 0.5); }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  // 🔹 Feature cards
  const features = [
    {
      title: "Real-Time AQI Mapping",
      desc: "Visualize pollution exposure across different routes in real time.",
    },
    {
      title: "Smart Route Suggestions",
      desc: "Choose routes that balance speed and air quality.",
    },
    {
      title: "Personal Pollution Score",
      desc: "Track how daily travel and habits impact your health.",
    },
    {
      title: "Eco-Friendly Alternatives",
      desc: "Get recommendations for greener transport and lifestyle.",
    },
    {
      title: "Predictive AQI Alerts",
      desc: "Know high-pollution zones before you reach them.",
    },
    {
      title: "Gamification & Rewards",
      desc: "Challenges, leaderboards, and rewards for greener choices.",
    },
  ];

  // 🔹 ADDED: Review data
  const reviews = [
    {
      name: "Priya Sharma",
      role: "Daily Office Commuter",
      text: "EcoSense completely changed how I travel. I now avoid high-pollution routes without adding much time.",
    },
    {
      name: "Rahul Mehta",
      role: "Fitness Enthusiast",
      text: "The pollution score made me aware of my habits. Small changes are making a big difference.",
    },
    {
      name: "Ananya Verma",
      role: "College Student",
      text: "The challenges and leaderboard keep me motivated. Going green finally feels fun!",
    },
  ];

  const aqiStates = [
    {
      state: "Delhi",
      aqi: 142,
      max: 300,
      status: "Unhealthy for Sensitive",
      color: "from-yellow-400 to-orange-500",
    },
    {
      state: "Maharashtra",
      aqi: 88,
      max: 300,
      status: "Moderate",
      color: "from-green-400 to-emerald-500",
    },
    {
      state: "Karnataka",
      aqi: 54,
      max: 300,
      status: "Good",
      color: "from-emerald-400 to-cyan-400",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-[linear-gradient(180deg,#0c1210_0%,#060908_100%)] text-[#f0f5f2]">
        <style>{keyframes}</style>

        <Navbar />

        {/* 🔹 NEW HERO SECTION */}
        <section className="relative flex items-center justify-center text-center px-6 py-32 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.18),transparent_65%)]"></div>

          <div
            className="relative z-10 max-w-4xl"
            style={{ animation: "fadeInUp 1.1s ease-out" }}
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-green-900/30 border border-green-600/30 text-green-400 text-sm">
              ✨ AI-Powered Sustainability
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Track Your Impact. <br />
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Breathe Cleaner Air.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-10">
              EcoSense calculates your personal Pollution Credit Score,
              recommends low-AQI routes, and helps you switch to sustainable
              alternatives — all in one app.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 text-black font-semibold flex items-center justify-center gap-2 hover:scale-105 transition"
                style={{ animation: "pulseGlow 2.5s infinite" }}

                onClick={() => navigation('/dashboard')}
              >
                Get Your Score →
              </button>

              <button className="px-8 py-4 rounded-xl border border-green-700/40 text-gray-200 hover:border-green-400 transition"
                onClick={() => navigation('/pitch')}
              >
                View Demo
              </button>
            </div>
          </div>
        </section>

        {/* 🔹 LIVE STATE AQI SECTION */}
        <LiveAQISection />
        <section className="py-24 px-8">
          <h2 className="text-3xl font-bold text-center text-green-400 mb-16">
            Live State AQI Overview 🌍
          </h2>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {aqiStates.map((item, index) => {
              const percentage = (item.aqi / item.max) * 100;

              return (
                <div
                  key={index}
                  className="relative bg-[#0f1a15] rounded-3xl p-8 border border-green-800/30 text-center"
                  style={{ animation: "scaleIn 0.6s ease forwards" }}
                >
                  {/* Glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(34,197,94,0.25),transparent_70%)] rounded-3xl blur-xl"></div>

                  <div className="relative z-10">
                    <p className="text-gray-400 text-sm mb-4">
                      Current {item.state} AQI
                    </p>

                    {/* Circular AQI Ring */}
                    <div className="relative w-40 h-40 mx-auto mb-6">
                      <svg className="w-full h-full rotate-[-90deg]">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="#1f2933"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="url(#grad)"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray="440"
                          strokeDashoffset={440 - (440 * percentage) / 100}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="grad">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-green-400">
                          {item.aqi}
                        </span>
                        <span className="text-xs text-gray-400">
                          / {item.max}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <span className="inline-block px-4 py-2 rounded-full text-sm bg-black/40 border border-green-700/40 text-green-300">
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        

        {/* 🌳 TREE STRUCTURE SECTION */}
        <section className="relative py-32 px-6 overflow-hidden">
          {/* Center Trunk */}
          <div className="relative z-10 flex justify-center mb-24">
            <div className="bg-[#0f1a15] px-12 py-10 rounded-full border border-green-500/40 shadow-[0_0_60px_rgba(34,197,94,0.4)] text-center">
              <h2 className="text-3xl font-bold text-green-400 mb-2">
                EcoSense 🌱
              </h2>
              <p className="text-gray-300 text-sm max-w-xs">
                The core engine that tracks, predicts, and reduces your
                pollution exposure.
              </p>
            </div>
          </div>

          {/* Branch Lines */}
          <div className="absolute inset-0 flex justify-center">
            <div className="w-[2px] h-full bg-gradient-to-b from-green-500/30 to-transparent"></div>
          </div>

          {/* Leaves */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-y-24 gap-x-16 max-w-6xl mx-auto">
            {[
              {
                title: "Real-Time AQI Mapping",
                desc: "Live visualization of pollution exposure across routes.",
                rotate: "-rotate-6",
              },
              {
                title: "Smart Route Suggestions",
                desc: "Balance speed with cleaner air choices.",
                rotate: "rotate-3",
              },
              {
                title: "Personal Pollution Score",
                desc: "Measure how your habits impact your health.",
                rotate: "-rotate-3",
              },
              {
                title: "Eco-Friendly Alternatives",
                desc: "Greener transport and lifestyle options.",
                rotate: "rotate-6",
              },
              {
                title: "Predictive AQI Alerts",
                desc: "Avoid high pollution zones before you reach them.",
                rotate: "-rotate-6",
              },
              {
                title: "Gamification & Rewards",
                desc: "Challenges and rewards that motivate green habits.",
                rotate: "rotate-3",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`relative bg-[#0f1a15] p-6 rounded-[3rem] border border-green-700/40 cursor-pointer shadow-[0_0_40px_rgba(34,197,94,0.25)] ${item.rotate} hover:rotate-0 hover:scale-105 transition duration-500`}
              >
                {/* Leaf Tip */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-green-400 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.8)]"></div>

                <h3 className="text-xl font-semibold text-green-400 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 🔹 ADDED: IMPACT STATS SECTION */}
        <section className="py-20 bg-[#0a1310]">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            <div>
              <h3 className="text-4xl font-bold text-green-400">40%</h3>
              <p className="text-gray-400 mt-2">Less Pollution Exposure</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-green-400">25%</h3>
              <p className="text-gray-400 mt-2">Lower Carbon Footprint</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-green-400">3×</h3>
              <p className="text-gray-400 mt-2">Higher Engagement</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-green-400">85%</h3>
              <p className="text-gray-400 mt-2">Behavior Change</p>
            </div>
          </div>
        </section>

        <section className="w-full relative overflow-hidden py-20">
          {/* Background Gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-r 
    from-[#1db9540d] via-[#1fa8a10d] to-[#199fe60d]"
          />

          <div className="relative z-10 mx-auto max-w-7xl px-4">
            <div
              className="
      rounded-3xl border border-[#1db95433]
      bg-[#0f1917cc] backdrop-blur-2xl
      p-8 sm:p-12 text-center
      shadow-[0_0_60px_rgba(29,185,84,0.15)]
    "
            >
              {/* Icon */}
              <Leaf
                className="
        mx-auto mb-6 h-16 w-16 text-[#1db954]
        animate-float
      "
              />

              {/* Heading */}
              <h2
                className="
        mb-4 font-bold
        text-[clamp(1.5rem,4vw,2.5rem)]
        font-['Space_Grotesk']
      "
              >
                Ready to Make a Difference?
              </h2>

              {/* Description */}
              <p
                className="
        mx-auto mb-8 max-w-xl
        text-[#6b7c75]
      "
              >
                Join thousands of eco-conscious citizens tracking their impact
                and breathing cleaner air with EcoSense.
              </p>

              {/* Button */}
              <Link to="/register">
                <button
                  className="
            inline-flex items-center gap-2
            rounded-xl px-8 py-4
            text-base font-semibold
            text-[#080d0b]
            bg-gradient-to-br from-[#1db954] to-[#1fa8a1]
            shadow-[0_0_30px_rgba(29,185,84,0.4)]
            transition-all duration-300
            hover:-translate-y-1
            hover:shadow-[0_0_50px_rgba(29,185,84,0.6)]
          "
                >
                  Start Your Journey
                  <ChevronRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* 🔹 ADDED: REVIEW / TESTIMONIAL SECTION */}
        <section className="py-24 px-8">
          <h2 className="text-3xl font-bold text-center text-green-400 mb-14">
            What Users Say 💬
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-[#0f1a15] p-6 rounded-2xl border border-green-800/30 hover:border-green-400 transition"
                style={{
                  animation: "fadeInUp 0.8s ease forwards",
                  animationDelay: `${index * 0.15}s`,
                }}
              >
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  “{review.text}”
                </p>
                <div>
                  <h4 className="text-green-400 font-semibold">
                    {review.name}
                  </h4>
                  <span className="text-gray-500 text-xs">{review.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        <Footer></Footer>
        
      </div>
    </>
  );
};

export default Home;
