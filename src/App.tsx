import LocationDetector from "./pages/LocationDetector";

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
  // const { location } = useLocationDetector();

  return (
    <div className="h-[100vh]">
      {/* <Camera /> */}
      <LocationDetector />
    </div>
  );
}
