export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3600,
      });
    } else {
      reject(new Error("Geolocation is not supported by this browser"));
    }
  });
};

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    // Note: Browser permissions work differently than mobile
    const result = await navigator.permissions.query({ name: "geolocation" });
    return result.state === "granted";
  } catch (error) {
    console.error("Error checking location permission:", error);
    return false;
  }
};

export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name || "Address not found";
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return "Unable to get address";
  }
};
