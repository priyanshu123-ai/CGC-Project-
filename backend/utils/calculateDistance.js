export const calculateDistanceKm = (coords) => {
  let distance = 0;
  const R = 6371;

  for (let i = 1; i < coords.length; i++) {
    const lat1 = (coords[i - 1].lat * Math.PI) / 180;
    const lon1 = (coords[i - 1].lon * Math.PI) / 180;
    const lat2 = (coords[i].lat * Math.PI) / 180;
    const lon2 = (coords[i].lon * Math.PI) / 180;

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distance += R * c;
  }

  return distance;
};