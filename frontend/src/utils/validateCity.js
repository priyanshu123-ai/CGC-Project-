import axios from "axios";

export const validateCity = async (input) => {
  try {
    if (!input || input.trim().length < 2) return null;

    const userInput = input.trim().toLowerCase();

    const res = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          q: input,
          key: import.meta.env.VITE_OPENCAGE_API_KEY,
          limit: 1,
          no_annotations: 1,
          countrycode: "in",
        },
      }
    );

    if (!res.data.results?.length) return null;

    const result = res.data.results[0];
    const c = result.components;

    let city =
      c.city ||
      c.city_district ||
      c.town ||
      c.municipality ||
      c.village ||
      c.suburb;

    if (!city) return null;

    city = city
      .replace(/\b(tahsil|tehsil|district|division|county|taluka)\b/gi, "")
      .trim();

    const normalizedCity = city.toLowerCase();

    /* ---------------- 🚫 CRITICAL CHECK ---------------- */
    // reject if input and result are not related
    if (
      !normalizedCity.includes(userInput) &&
      !userInput.includes(normalizedCity)
    ) {
      return null; // ❌ xyz → Thane blocked here
    }

    return {
      city,
      lat: result.geometry.lat,
      lon: result.geometry.lng,
    };
  } catch (err) {
    console.error("City validation failed:", err.message);
    return null;
  }
};
