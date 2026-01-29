import axios from "axios";

export const getRouteDistanceAndTime = async (origin, destination) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=false&alternatives=false&steps=false`;

  const res = await axios.get(url);

  if (!res.data.routes?.length) {
    throw new Error("OSRM route not found");
  }

  const route = res.data.routes[0];

  return {
    distanceKm: Number((route.distance / 1000).toFixed(1)), // ✅ 19.8
    durationMin: Math.round(route.duration / 60),
  };
};