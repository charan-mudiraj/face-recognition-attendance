import { Route, Routes } from "react-router";
import LocationDetector from "./pages/LocationDetector";
import Camera from "./pages/Camera";
import Home from "./pages/Home";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { PrimeReactProvider } from "primereact/api";

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
    <PrimeReactProvider value={{}}>
      <div className="h-[100vh] p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/location" element={<LocationDetector />} />
        </Routes>
      </div>
    </PrimeReactProvider>
  );
}
