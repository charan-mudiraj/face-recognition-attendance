import useLocationDetector from "../hooks/useLocationDetector";

export default function LocationDetector() {
  const { isInLocation, location } = useLocationDetector();
  return (
    <div>
      <p>Is Inside : {isInLocation ? "Yes" : "No"}</p>
      <p>latitude: {location.latitude}</p>
      <p>longitude: {location.longitude}</p>
      <p>accuracy: {location.accuracy}</p>
    </div>
  );
}
