import axios from "axios";

export const getAQIByCoords = async (lat, lon) => {
  try {
    const res = await axios.get(
      `https://api.waqi.info/feed/geo:${lat};${lon}/`,
      {
        params: { token: process.env.AQICN_API_KEY },
      }
    );

    if (res.data.status !== "ok") {
      return { aqi: null };
    }

    return { aqi: res.data.data.aqi };
  } catch {
    return { aqi: null };
  }
};