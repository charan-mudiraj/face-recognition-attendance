import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import descriptorsJSON from "../assets/descriptors.json";
import { LoaderCircle } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { DB } from "../firebase";
import { StudentDetail } from "../types";

const MODEL_URL = "/models";

const loadModels = async () => {
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    console.log("✅ Models Loaded!");
  } catch (error) {
    console.error("Failed to load models:", error);
  }
};

// const saveJSON = (json: Record<any, any>) => {
//   const blob = new Blob([JSON.stringify(json)], {
//     type: "application/json",
//   });
//   const url = URL.createObjectURL(blob);

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "data.json";
//   a.click();

//   URL.revokeObjectURL(url);
// };
// const imageFiles = Array.from(
//   { length: 64 },
//   (_, i) => `/instances/${i + 1}.png`
// );
// interface Descriptor {
//   id: number;
//   descriptor: Float32Array;
// }

const Camera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bestMatch, setBestMatch] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const matchedDescriptorRef = useRef<Float32Array>(null);
  const lastDescriptorRef = useRef<Float32Array | null>(null);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        if (canvasRef.current) {
          canvasRef.current.style.width = `${videoRef.current.style.width}px`;
          canvasRef.current.style.height = `${videoRef.current.style.height}px`;
        }
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const detectFace = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const processDetection = async () => {
      if (!ctx) return;

      const detections = await faceapi.detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions()
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detections) {
        const { x, y, width, height } = detections.box;
        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);

        ctx.font = "18px Arial";
        ctx.fillStyle = "#00FF00";
        ctx.fillText("Face Detected", x, y + height + 20);

        getBestMatch(); // Call best match asynchronously
      }

      setTimeout(processDetection, 500); // Reduce unnecessary CPU load
    };

    processDetection();
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL("image/png");
      return imageUrl;
    }
  };

  const getBestMatch = async () => {
    const imgUrl = capturePhoto();
    if (imgUrl) {
      const descriptor = await getFaceDescriptor(imgUrl);
      matchedDescriptorRef.current = descriptor;
      if (descriptor) {
        if (
          lastDescriptorRef.current &&
          faceapi.euclideanDistance(lastDescriptorRef.current, descriptor) < 0.1
        ) {
          return;
        }
        lastDescriptorRef.current = descriptor;
        findBestMatch(descriptor);
      }
    }
  };

  const onCapture = async () => {
    setLoading(true);
    if (!bestMatch) return;
    try {
      const rollNo = bestMatch.toString().padStart(2, "0");
      const todayDate = new Date().toISOString().split("T")[0];
      const docId = `215U1A67${rollNo}`;
      const detailsDoc = await getDoc(doc(DB, "students", docId));
      const details = detailsDoc.data() as StudentDetail;
      console.log(details);
      const attDoc = await getDoc(doc(DB, todayDate, docId));
      if (attDoc.exists()) {
        setError("Attendance Already Uploaded with name " + details.name);
      } else {
        await setDoc(doc(DB, todayDate, docId), {
          timestamp: new Date(),
          name: details.name,
          descriptor: Array.from(matchedDescriptorRef.current!),
        });
      }
    } catch (err) {
      setError("Failed to Upload Attendance");
      console.error(err);
    }
    setLoading(false);
  };

  //   const loadAllDescriptors = async () => {
  //     const arr = [];
  //     for (const file of imageFiles) {
  //       const img = await faceapi.fetchImage(file);
  //       const detection = await faceapi
  //         .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
  //         .withFaceLandmarks()
  //         .withFaceDescriptor();

  //       if (detection) {
  //         arr.push({
  //           id: file.match(/\d+(\.\d+)?/g)?.map(Number)[0]!,
  //           descriptor: Array.from(detection.descriptor),
  //         });
  //       } else {
  //         console.log("skipped ", file);
  //       }
  //     }
  //     saveJSON(arr);
  //     console.log("✅ All face descriptors loaded!");
  //   };

  const findBestMatch = (capturedDescriptor: Float32Array) => {
    let bestMatchFile = null;
    let bestMatchScore = Infinity; // Lower is better
    const descriptors = structuredClone(descriptorsJSON);

    descriptors.forEach(({ id, descriptor }) => {
      const distance = faceapi.euclideanDistance(
        capturedDescriptor,
        descriptor
      );
      if (distance < bestMatchScore) {
        bestMatchScore = distance;
        bestMatchFile = id;
      }
    });

    setBestMatch(bestMatchFile);
    console.log("✅ Best Match:", bestMatchFile);
  };

  const getFaceDescriptor = async (imageUrl: string) => {
    const img = await faceapi.fetchImage(imageUrl);
    const detections = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    return detections?.descriptor || null;
  };

  useEffect(() => {
    loadModels().then(() => {
      startVideo();
      videoRef.current?.addEventListener("play", detectFace);
      //   loadAllDescriptors();
    });
  }, []);

  return (
    <div className="flex flex-col items-center p-4 h-full justify-around">
      <div className="relative w-full h-[70%] flex justify-center rounded-2xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute w-full h-full rounded-2xl"
          style={{ objectFit: "cover" }}
        />
        <canvas
          ref={canvasRef}
          className="absolute opacity-[0.9] w-full h-full rounded-2xl"
        />
      </div>
      <div className="border-1 border-zinc-500 w-full rounded-xl p-2">
        <p className="font-medium text-xl">
          Matched Roll Number:{" "}
          {bestMatch ? (
            <span className="text-white">{bestMatch}</span>
          ) : (
            <span className="text-white italic animate-pulse">Loading...</span>
          )}
        </p>
      </div>
      <p className="font-bold text-xl text-red-500">{error}</p>
      <div className="h-14 p-1 w-14 relative flex items-center justify-center">
        {loading ? (
          <LoaderCircle className="animate-spin h-full w-full absolute" />
        ) : (
          <button
            onClick={onCapture}
            disabled={!Boolean(bestMatch)}
            className="mt-4 text-white h-full w-full rounded-full hover:bg-blue-600 absolute disabled:opacity-[0.3]"
            name="capture btn"
          >
            <img
              src="shutter-camera.png"
              style={{
                filter: "invert(1.3)",
              }}
              alt="shutter camera"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default Camera;
