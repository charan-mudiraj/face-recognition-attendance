import useLocationDetector from "../hooks/useLocationDetector";

export default function LocationDetector() {
  const { isInLocation, location, getLocation } = useLocationDetector();
  return (
    <div>
      <p>Is In Location : {isInLocation ? "Yes" : "No"}</p>
      <p>latitude: {location.latitude}</p>
      <p>longitude: {location.longitude}</p>
      <button onClick={getLocation}>Detect</button>
    </div>
  );
}
