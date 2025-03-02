import { useState, useEffect, useMemo } from "react";
import { point, polygon, booleanPointInPolygon } from "@turf/turf";

export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}

// const getPolygonBounds = () => {
//   const bounds = window.localStorage.getItem("polygon-bounds");

//   if (bounds) {
//     return JSON.parse(bounds) as Position[][];
//   }
//   return [
//     [
//       [0, 0],
//       [0, 0],
//       [0, 0],
//       [0, 0],
//       [0, 0],
//     ],
//   ];
// };

const useLocationDetector = () => {
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
    accuracy: 1000,
  });
  // const polygonBoundsRef = useRef<Position[][]>(getPolygonBounds());

  // const storePolygonBounds = (coordinates: Position[][]) => {
  //   window.localStorage.setItem("polygon-bounds", JSON.stringify(coordinates));
  //   polygonBoundsRef.current = coordinates;
  // };

  const isInLocation = useMemo(
    () =>
      booleanPointInPolygon(
        point([location.longitude, location.latitude]),
        polygon([
          [
            [78.620419773312, 17.246489946956245],
            [78.62136816583467, 17.246667613413038],
            [78.62143017611419, 17.246314022158614],
            [78.62048725508794, 17.24612764619974],
            [78.620419773312, 17.246489946956245],
          ],
        ])
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
    // storePolygonBounds,
    // polygonBounds: polygonBoundsRef.current,
  };
};

export default useLocationDetector;
