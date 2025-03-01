import { useState, useEffect, useMemo } from "react";

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}
const isPointInsidePolygon = (
  point: { lat: number; lon: number },
  polygon: { lat: number; lon: number }[]
) => {
  let inside = false;
  const x = point.lon,
    y = point.lat;
  const epsilon = 1e-9; // Small threshold to handle floating-point precision

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lon,
      yi = polygon[i].lat;
    const xj = polygon[j].lon,
      yj = polygon[j].lat;

    const intersect =
      Math.abs(yi - y) > epsilon !== Math.abs(yj - y) > epsilon &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + epsilon) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
};

const roomBounds = [
  { lat: 17.3294284, lon: 78.4338452 }, // Corner 1
  { lat: 17.3293436, lon: 78.43337994 }, // Corner 2
  { lat: 17.3292061, lon: 78.4337027 }, // Corner 3
  { lat: 17.3291804, lon: 78.4337387 }, // Corner 4
];
const useLocationDetector = () => {
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
    accuracy: 1000,
  });

  const isInLocation = useMemo(
    () =>
      isPointInsidePolygon(
        { lat: location.latitude, lon: location.longitude },
        roomBounds
      ),
    [location]
  );

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
