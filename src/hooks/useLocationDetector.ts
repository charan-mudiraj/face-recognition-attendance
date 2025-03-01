import { useState, useEffect } from "react";

interface Location {
  latitude: number;
  longitude: number;
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
  });

  const isInLocation =
    location.latitude >= squareBounds.latMin &&
    location.latitude <= squareBounds.latMax &&
    location.longitude >= squareBounds.lonMin &&
    location.longitude <= squareBounds.lonMax;

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      getLocation();
    } else {
      console.error("Geolocation is not supported");
    }
  }, []);

  return {
    isInLocation,
    location,
    getLocation,
  };
};

export default useLocationDetector;
