import axios from "axios";

export const geocodeCity = async (input) => {
  try {
    if (!input) return null;

    const res = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          q: `${input}, India`,
          key: process.env.OPENCAGE_API_KEY,
          limit: 1,
          no_annotations: 1,
        },
        timeout: 15000,
      }
    );

    if (!res.data?.results?.length) return null;

    const data = res.data.results[0];

    return {
      name: input,
      lat: data.geometry.lat,
      lon: data.geometry.lng,
    };
  } catch (err) {
    console.error("OpenCage error:", err.message);
    return null;
  }
};