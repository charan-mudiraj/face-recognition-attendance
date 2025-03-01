// import useLocationChecker from "./hooks/useLocationChecker";
import Camera from "./pages/Camera";

// const uploadStudentsDetails = async () => {
//   const details = structuredClone(detailsJSON);
//   for (const detail of details) {
//     try {
//       await setDoc(doc(DB, "students", detail.ht_no), detail);
//       console.log("Successfully uploaded: ", detail.ht_no);
//     } catch (err) {
//       console.log("Failed to upload: ", detail.ht_no);
//     }
//   }
// };

export default function App() {
  // const { location } = useLocationChecker();

  return (
    <div className="h-[100vh]">
      <Camera />
      {/* <p className="">Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p> */}
    </div>
  );
}
