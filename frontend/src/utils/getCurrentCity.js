export const getCurrentCity = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        // Reverse geocoding (OpenStreetMap)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();

        resolve(
          data.address.city ||
          data.address.town ||
          data.address.state
        );
      },
      () => reject("Permission denied")
    );
  });
