import { useEffect, useState } from "react";

const PollutionScoreRing = ({
  score,
  maxScore = 900,
  size = 200,
  strokeWidth = 12,
  animated = true,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const percentage = (animatedScore / maxScore) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  const getColor = () => {
    if (percentage >= 80) return "#22c55e";
    if (percentage >= 60) return "#14b8a6";
    if (percentage >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const color = getColor();

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-30"
        style={{ backgroundColor: color }}
      />

      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1f2933"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 12px ${color})` }}
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-bold" style={{ color }}>
          {Math.round(animatedScore)}
        </span>
        <span className="text-gray-400 text-sm">/ {maxScore}</span>
      </div>
    </div>
  );
};

export default PollutionScoreRing;
