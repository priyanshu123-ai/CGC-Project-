import axios from "axios";

export const reverseGeocode = async (lat, lon) => {
  try {
    const url = "https://nominatim.openstreetmap.org/reverse";

    const res = await axios.get(url, {
      params: {
        lat,
        lon,
        format: "json",
        zoom: 14,
        addressdetails: 1,
      },
      headers: {
        // 🔴 REQUIRED by OpenStreetMap
        "User-Agent": "EcoSense/1.0 (contact@ecosense.app)",
      },
      timeout: 8000,
    });

    const address = res.data?.address;
    if (!address) return "Along Route";

    // 🔥 SMART FALLBACK ORDER (IMPORTANT)
    return (
      address.neighbourhood ||
      address.suburb ||
      address.road ||
      address.village ||
      address.town ||
      address.city ||
      address.county ||
      address.state ||
      "Along Route"
    );
  } catch (err) {
    return "Along Route";
  }
};
