import axios from "axios";

export const cityAutocomplete = async (query) => {
  if (!query || query.length < 2) return [];

  const q = query.toLowerCase();

  try {
    const res = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          q: query,
          key: import.meta.env.VITE_OPENCAGE_API_KEY,
          limit: 10, // 👈 fetch more, we rank ourselves
          no_annotations: 1,
          countrycode: "in",
        },
      }
    );

    if (!res.data.results?.length) return [];

    // 1️⃣ extract city-like names
    let cities = res.data.results
      .map((r) => {
        const c = r.components;
        const city =
          c.city ||
          c.town ||
          c.municipality ||
          c.village ||
          c.suburb;

        if (!city) return null;

        return {
          city,
          label: `${city}${c.state ? ", " + c.state : ""}`,
        };
      })
      .filter(Boolean);

    // 2️⃣ remove duplicates
    const seen = new Set();
    cities = cities.filter((c) => {
      const key = c.city.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // 3️⃣ custom ranking (MOST IMPORTANT PART)
    cities.sort((a, b) => {
      const aCity = a.city.toLowerCase();
      const bCity = b.city.toLowerCase();

      // exact prefix match first (Mumbai > Navi Mumbai)
      const aStarts = aCity.startsWith(q);
      const bStarts = bCity.startsWith(q);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // shorter name wins (Mumbai > Mumbai Suburban)
      return aCity.length - bCity.length;
    });

    // 4️⃣ return top 5
    return cities.slice(0, 5);
  } catch (err) {
    console.error("Autocomplete failed:", err.message);
    return [];
  }
};
