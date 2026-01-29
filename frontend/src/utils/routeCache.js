const TTL = 10 * 60 * 1000; // 10 minutes

export const getCachedRoute = (origin, destination) => {
  const key = `route:${origin}:${destination}`;
  const raw = localStorage.getItem(key);

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    if (Date.now() - parsed.timestamp > TTL) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export const setCachedRoute = (origin, destination, data) => {
  const key = `route:${origin}:${destination}`;
  localStorage.setItem(
    key,
    JSON.stringify({
      timestamp: Date.now(),
      data,
    })
  );
};
