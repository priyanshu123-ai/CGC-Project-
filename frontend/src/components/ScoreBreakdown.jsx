import { Zap, Car, ShoppingBag, Leaf } from "lucide-react";

const ScoreBreakdown = ({ answers }) => {
  // Calculate category scores from backend answers
  const calculateCategoryScores = () => {
    const maxPerCategory = 225;

    // Energy Usage - based on electricity consumption
    const electricityScore = answers?.electricity
      ? Math.max(
          0,
          Math.min(maxPerCategory, maxPerCategory - answers.electricity / 10)
        )
      : 180;

    // Transportation - based on distance and transport type
    const transportMultiplier =
      answers?.transport === "public"
        ? 1.2
        : answers?.transport === "bike"
        ? 1.5
        : answers?.transport === "walk"
        ? 1.5
        : answers?.transport === "car"
        ? 0.6
        : 1;

    const transportScore = answers?.distance
      ? Math.max(
          0,
          Math.min(
            maxPerCategory,
            (maxPerCategory - answers.distance * 2) * transportMultiplier
          )
        )
      : 150;

    // Shopping / Diet Habits
    const dietMultiplier =
      answers?.diet === "vegan"
        ? 1.5
        : answers?.diet === "vegetarian"
        ? 1.3
        : answers?.diet === "pescatarian"
        ? 1.1
        : 0.8;

    const shoppingScore = Math.min(maxPerCategory, 100 * dietMultiplier);

    // Lifestyle - recycling habits
    const recyclingMultiplier =
      answers?.recycling === "always"
        ? 1.5
        : answers?.recycling === "often"
        ? 1.3
        : answers?.recycling === "sometimes"
        ? 1.0
        : 0.6;

    const lifestyleScore = Math.min(maxPerCategory, 150 * recyclingMultiplier);

    return [
      {
        label: "Energy Usage",
        value: Math.round(electricityScore),
        max: maxPerCategory,
        icon: <Zap className="w-5 h-5" />,
        color: "#F59E0B",
      },
      {
        label: "Transportation",
        value: Math.round(transportScore),
        max: maxPerCategory,
        icon: <Car className="w-5 h-5" />,
        color: "#14B8A6",
      },
      {
        label: "Shopping Habits",
        value: Math.round(shoppingScore),
        max: maxPerCategory,
        icon: <ShoppingBag className="w-5 h-5" />,
        color: "#3B82F6",
      },
      {
        label: "Lifestyle",
        value: Math.round(lifestyleScore),
        max: maxPerCategory,
        icon: <Leaf className="w-5 h-5" />,
        color: "#22C55E",
      },
    ];
  };

  const categories = calculateCategoryScores();

  return (
    <div
      className="p-6 rounded-2xl backdrop-blur-xl"
      style={{
        background: "rgba(15, 25, 23, 0.7)",
        border: "1px solid rgba(37, 58, 52, 0.5)",
      }}
    >
      <h3 className="text-xl font-bold text-white mb-6">
        Score Breakdown
      </h3>

      <div className="space-y-5">
        {categories.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span style={{ color: category.color }}>
                  {category.icon}
                </span>
                <span className="text-white font-medium">
                  {category.label}
                </span>
              </div>
              <span className="text-gray-400 text-sm">
                {category.value}/{category.max}
              </span>
            </div>

            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "rgba(255, 255, 255, 0.1)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${(category.value / category.max) * 100}%`,
                  background: `linear-gradient(90deg, ${category.color}, ${category.color}99)`,
                  boxShadow: `0 0 10px ${category.color}50`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreBreakdown;
