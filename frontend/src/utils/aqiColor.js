export const getAQIColorClass = (aqi) => {
  if (aqi == null) return "text-gray-400 bg-gray-400/10";

  if (aqi <= 50) return "text-green-400 bg-green-400/10";
  if (aqi <= 100) return "text-yellow-400 bg-yellow-400/10";
  if (aqi <= 200) return "text-orange-400 bg-orange-400/10";
  return "text-red-500 bg-red-500/10";
};
