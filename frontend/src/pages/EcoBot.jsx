import Navbar from "@/components/Navbar";
import React from "react";
import {
  TrendingUp,
  ShoppingBag,
  Route,
  Leaf,
  Lightbulb,
} from "lucide-react";
import ChatInterface from "@/components/ChatInterface";

const EcoBot = () => {
  const quickPrompts = [
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: "How can I improve my score?",
    },
    {
      icon: <ShoppingBag className="w-4 h-4" />,
      label: "Suggest sustainable brands",
    },
    {
      icon: <Route className="w-4 h-4" />,
      label: "Best time to travel today?",
    },
    {
      icon: <Leaf className="w-4 h-4" />,
      label: "Tips for reducing energy use",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Heading */}
          <div className="mb-6 animate-fade-in text-center">
            <h1 className="font-bold text-4xl mb-2">
              Chat with{" "}
              <span className="bg-[linear-gradient(135deg,hsl(152_76%_45%),hsl(175_70%_40%),hsl(200_80%_50%))] bg-clip-text text-transparent">
                EcoBot
              </span>
            </h1>
            <p className="text-[rgb(120,130,140)] text-xl">
              Your AI-powered sustainability assistant
            </p>
          </div>

          {/* Quick prompts */}
          <div className="flex flex-col items-center gap-3 mb-6 animate-fade-in [animation-delay:100ms]">

            {/* First row → 3 buttons */}
            <div className="flex gap-4">
              {quickPrompts.slice(0, 3).map((prompt, index) => (
                <button
                  key={index}
                  className="
                    flex items-center gap-2
                    px-6 py-3
                    rounded-full
                    border border-white/50
                    text-white
                    text-sm font-medium
                    bg-transparent
                    hover:bg-white/10
                    hover:border-white/60
                    transition-colors duration-200
                  "
                >
                  {prompt.icon}
                  {prompt.label}
                </button>
              ))}
            </div>

            {/* Second row → remaining buttons */}
            <div className="flex gap-4">
              {quickPrompts.slice(3).map((prompt, index) => (
                <button
                  key={index}
                  className="
                    flex items-center gap-2
                    px-6 py-3
                    rounded-full
                    border border-white/50
                    text-white
                    text-sm font-semibold
                    bg-transparent
                    hover:bg-white/10
                    hover:border-white/60
                    transition-colors duration-200
                  "
                >
                  {prompt.icon}
                  {prompt.label}
                </button>
              ))}
            </div>
            <div className="animate-fade-in [animation-delay:200ms]">
              <ChatInterface />

            </div>

          </div>
          <div className="mt-6 animate-fade-in [animation-delay:300ms]">
  <div
    className="
      flex items-center gap-4
      rounded-2xl
      px-5 py-4
      backdrop-blur-md
      bg-[linear-gradient(135deg,rgba(27,42,36,0.85),rgba(19,31,26,0.85))]
      ring-1 ring-white/10
      shadow-[0_0_40px_rgba(29,185,84,0.08)]
    "
  >
    {/* ICON */}
    <div className="w-10 h-10 rounded-xl bg-[linear-gradient(135deg,#f59e0b,#fbbf24)]/15 flex items-center justify-center shrink-0">
      <Lightbulb className="w-5 h-5 text-[#fbbf24]" />
    </div>

    {/* TEXT */}
    <p className="text-sm leading-relaxed text-[#cfe3d8]">
      <span className="text-white font-medium">Pro tip:</span>{" "}
      Ask EcoBot about specific products, your commute route, or ways to reduce
      your carbon footprint based on your lifestyle data.
    </p>
  </div>
</div>


        </div>
      </main>
    </div>
  );
};

export default EcoBot;
