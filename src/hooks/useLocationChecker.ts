import { useState, useEffect } from "react";

interface Location {
  latitude: number;
  longitude: number;
}

const useLocationChecker = () => {
  const [isInLocation, setIsInLocation] = useState<boolean>(false);
  //   const locationRef = useRef<Location | null>(null);
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });

  // Given coordinates (square boundary)
  const squareBounds = {
    latMin: 12.95, // Bottom-left latitude
    latMax: 12.96, // Top-right latitude
    lonMin: 77.59, // Bottom-left longitude
    lonMax: 77.6, // Top-right longitude
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          //   locationRef.current = { latitude, longitude };
          //   console.log(locationRef.current);
          setLocation({ latitude, longitude });

          // Check if inside the square bounds
          if (
            latitude >= squareBounds.latMin &&
            latitude <= squareBounds.latMax &&
            longitude >= squareBounds.lonMin &&
            longitude <= squareBounds.lonMax
          ) {
            setIsInLocation(true);
          } else {
            setIsInLocation(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsInLocation(false);
        }
      );
    } else {
      console.error("Geolocation is not supported");
      setIsInLocation(false);
    }
  }, []);

  return {
    isInLocation,
    // location: {
    //   latitude: locationRef.current?.latitude,
    //   logitude: locationRef.current?.longitude,
    // },
    location,
  };
};

export default useLocationChecker;
