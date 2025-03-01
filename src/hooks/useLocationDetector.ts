import { useState, useEffect } from "react";

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}
// Given coordinates (square boundary)
const squareBounds = {
  latMin: 12.95, // Bottom-left latitude
  latMax: 12.96, // Top-right latitude
  lonMin: 77.59, // Bottom-left longitude
  lonMax: 77.6, // Top-right longitude
};

const useLocationDetector = () => {
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
    accuracy: 1000,
  });

  const isInLocation =
    location.latitude >= squareBounds.latMin &&
    location.latitude <= squareBounds.latMax &&
    location.longitude >= squareBounds.lonMin &&
    location.longitude <= squareBounds.lonMax;

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.error("Geolocation is not supported");
      return;
    }

    // Watch position for continuous updates
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        // Accept only high-accuracy readings (e.g., < 10 meters)

        setLocation({ latitude, longitude, accuracy });
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return {
    isInLocation,
    location,
  };
};

export default useLocationDetector;
