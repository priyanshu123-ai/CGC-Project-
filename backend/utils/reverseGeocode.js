import axios from "axios";

export const reverseGeocode = async (lat, lon) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "EcoSense-App",
      },
    });

    return (
      res.data.address?.city ||
      res.data.address?.town ||
      res.data.address?.village ||
      res.data.address?.state ||
      "Unknown Area"
    );
  } catch {
    return "Unknown Area";
  }
};