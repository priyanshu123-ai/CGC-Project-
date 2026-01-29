export const estimateTimeMinutes = (distanceKm, roadType = "city") => {
  const SPEEDS = {
    motorway: 70,
    trunk: 60,
    primary: 50,
    secondary: 40,
    residential: 30,
    city: 35,
  };

  const speed = SPEEDS[roadType] || SPEEDS.city;
  return Math.round((distanceKm / speed) * 60);
};