import { useState, useEffect, useMemo, useRef } from "react";
import { point, polygon, booleanPointInPolygon } from "@turf/turf";
import { Position } from "geojson";

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const roomBounds = polygon([
  [
    [78.4336066549015, 17.329206057872582],
    [78.43370649006863, 17.32916920013814],
    [78.43367670499202, 17.329090745795142],
    [78.43357742139841, 17.329129183162024],
    [78.4336066549015, 17.329206057872582],
  ],
]);

const getPolygonBounds = () => {
  const bounds = window.localStorage.getItem("polygon-bounds");

  if (bounds) {
    return JSON.parse(bounds) as Position[][];
  }
  return [
    [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ],
  ];
};

const useLocationDetector = () => {
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
    accuracy: 1000,
  });
  const polygonBoundsRef = useRef<Position[][]>(getPolygonBounds());

  const storePolygonBounds = (coordinates: Position[][]) => {
    window.localStorage.setItem("polygon-bounds", JSON.stringify(coordinates));
    polygonBoundsRef.current = coordinates;
  };

  const isInLocation = useMemo(
    () =>
      booleanPointInPolygon(
        point([location.longitude, location.latitude]),
        polygon(getPolygonBounds())
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
    storePolygonBounds,
    polygonBounds: polygonBoundsRef.current,
  };
};

export default useLocationDetector;
