import { useState } from "react";
import { showToast } from "../api/toastService";

const useLocation = () => {
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    setIsGettingLocation(true);
    setLocationError(null);

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = "Geolocation is not supported by your browser";
        setLocationError(error);
        setIsGettingLocation(false);
        reject(new Error(error));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsGettingLocation(false);
          resolve(position);
        },
        (error) => {
          let errorMessage = "Error getting location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
          }
          setLocationError(errorMessage);
          setIsGettingLocation(false);
          reject(new Error(errorMessage));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      if (navigator.permissions) {
        const result = await navigator.permissions.query({
          name: "geolocation",
        });
        return result.state === "granted";
      }
      return true; // If permissions API not available, assume we can ask
    } catch (error) {
      console.error("Error checking location permission:", error);
      return false;
    }
  };

  return {
    getCurrentLocation,
    requestLocationPermission,
    locationError,
    isGettingLocation,
  };
};

export default useLocation;
