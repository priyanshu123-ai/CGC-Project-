import NodeCache from "node-cache";

const aqiCache = new NodeCache({
  stdTTL: 600,     
  checkperiod: 120,
});

export default aqiCache;