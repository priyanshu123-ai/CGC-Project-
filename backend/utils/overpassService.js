import axios from "axios";

const OVERPASS_URL = "https://overpass.kumi.systems/api/interpreter";

export const getRoadsBetweenPoints = async (
  lat1, lon1, lat2, lon2
) => {
  const query = `
    [out:json][timeout:25];
    (
      way["highway"](around:3000,${lat1},${lon1});
      way["highway"](around:3000,${lat2},${lon2});
    );
    out geom;
  `;

  try {
    const res = await axios.post(OVERPASS_URL, query, {
      headers: { "Content-Type": "text/plain" },
    });

    return res.data.elements.filter(e => e.type === "way");
  } catch {
    return [];
  }
};