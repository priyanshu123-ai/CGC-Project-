import axios from "axios";

export const reverseGeocode = async (lat, lon) => {
  try {
    // 🚀 Using BigDataCloud Free API (Much Faster, No Rate Limit for client-side use style)
    const url = "https://api.bigdatacloud.net/data/reverse-geocode-client";

    const res = await axios.get(url, {
      params: {
        latitude: lat,
        longitude: lon,
        localityLanguage: "en",
      },
      timeout: 10000, // 10s is enough for this fast API
    });

    const data = res.data;
    if (!data) return "Along Route";

    // 🔥 SMART FALLBACK for BigDataCloud
    return (
      data.locality ||
      data.city ||
      data.principalSubdivision ||
      data.countryName ||
      "Along Route"
    );
  } catch (err) {
    console.error("Reverse Geocode Error:", err.message);
    return "Along Route";
  }
};