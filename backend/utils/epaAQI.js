export const calculateAQI_PM25 = (pm25) => {
  const table = [
    { cL: 0.0, cH: 12.0, aL: 0, aH: 50 },
    { cL: 12.1, cH: 35.4, aL: 51, aH: 100 },
    { cL: 35.5, cH: 55.4, aL: 101, aH: 150 },
    { cL: 55.5, cH: 150.4, aL: 151, aH: 200 },
    { cL: 150.5, cH: 250.4, aL: 201, aH: 300 },
    { cL: 250.5, cH: 350.4, aL: 301, aH: 400 },
    { cL: 350.5, cH: 500.4, aL: 401, aH: 500 }
  ];

  for (const r of table) {
    if (pm25 >= r.cL && pm25 <= r.cH) {
      return Math.round(
        ((r.aH - r.aL) / (r.cH - r.cL)) * (pm25 - r.cL) + r.aL
      );
    }
  }
  return null;
};