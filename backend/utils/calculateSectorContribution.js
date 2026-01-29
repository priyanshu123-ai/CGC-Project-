const log = (v) => Math.log(v + 1);

export const calculateSectorContribution = (sources) => {
  const weighted = {
    transport: log(sources.transport) * 2.5,
    industry: log(sources.industry) * 4.5,
    power: log(sources.power) * 6,
    construction: log(sources.construction) * 3,
  };

  const total =
    weighted.transport +
    weighted.industry +
    weighted.power +
    weighted.construction;

  if (total === 0) {
    return {
      transport: 0,
      industry: 0,
      power: 0,
      construction: 0,
      others: 100,
    };
  }

  // use floor instead of round
  let transport = Math.floor((weighted.transport / total) * 100);
  let industry = Math.floor((weighted.industry / total) * 100);
  let power = Math.floor((weighted.power / total) * 100);
  let construction = Math.floor((weighted.construction / total) * 100);

  let used = transport + industry + power + construction;

  return {
    transport,
    industry,
    power,
    construction,
    others: 100 - used, // always >= 0
  };
};