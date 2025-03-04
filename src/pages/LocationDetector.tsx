import useLocationDetector, { Location } from "../hooks/useLocationDetector";
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Locate, MapPin } from "lucide-react";
import { icon } from "leaflet";

export default function LocationDetector() {
  const { isInLocation, location } = useLocationDetector();
  // const boundsRef = useRef<Position[][]>(polygonBounds);

  // const onBoundValueChange = (
  //   index: number,
  //   value: number,
  //   type: "lat" | "lon"
  // ) => {
  //   boundsRef.current[0][index][type === "lon" ? 0 : 1] = value;
  // };

  return (
    <div className="space-y-5">
      {/* <form
        className="place-items-center space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          boundsRef.current[0][4][0] = boundsRef.current[0][0][0];
          boundsRef.current[0][4][1] = boundsRef.current[0][0][1];
          storePolygonBounds(boundsRef.current);
        }}
      >
        <p className="text-2xl">Set Area Bounds</p>
        <div className="grid grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <React.Fragment key={i}>
              <Input
                placeholder={`C${i + 1} longitude`}
                keyfilter={"pnum"}
                defaultValue={polygonBounds[0][i][0]}
                onChange={(val) => onBoundValueChange(i, Number(val), "lon")}
              />
              <Input
                placeholder={`C${i + 1} latitude`}
                keyfilter={"pnum"}
                defaultValue={polygonBounds[0][i][1]}
                onChange={(val) => onBoundValueChange(i, Number(val), "lat")}
              />
            </React.Fragment>
          ))}
        </div>
        <Button type="submit" label="Set" />
      </form> */}
      <p className="text-xl text-center">Location Stats</p>
      <div className="space-y-1">
        <div className="flex gap-1">
          <div className="flex items-center">
            <MapPin height={"16px"} />
            Is In Destination(C-Block):
          </div>
          <span
            className={`font-semibold ${
              isInLocation ? "text-green-400" : "text-red-400"
            } `}
          >
            {isInLocation ? "Yes" : "No"}
          </span>{" "}
        </div>
        <div className="flex items-center">
          <Locate height={"16px"} />
          Your Current Location:
        </div>
        <div className="ml-10">
          <p>
            - Latitude:{" "}
            <span className="font-semibold text-cyan-500">
              {location.latitude}
            </span>
          </p>
          <p>
            - Longitude:{" "}
            <span className="font-semibold text-cyan-500">
              {location.longitude}
            </span>
          </p>
          <p>
            - Accuracy(in meters):{" "}
            <span className="font-semibold text-cyan-500">
              {location.accuracy}
            </span>
          </p>
        </div>
      </div>
      <div
        className={`border-4 ${
          isInLocation ? "border-green-500" : "border-zinc-700"
        } rounded-xl bg-[#f2efe9]`}
        style={{ height: "500px", width: "100%" }}
      >
        {location.latitude !== 0 && location.longitude !== 0 && (
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={19}
            className="h-full w-full rounded-xl"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Polygon
              positions={[
                [17.246489946956245, 78.620419773312],
                [17.246667613413038, 78.62136816583467],
                [17.246314022158614, 78.62143017611419],
                [17.24612764619974, 78.62048725508794],
                [17.246489946956245, 78.620419773312],
              ]}
              color="green"
            />

            <Marker
              alt="You"
              icon={icon({
                iconUrl: "/location.png",
                iconSize: [32, 32], // Size of the icon
                iconAnchor: [16, 32], // Point of the icon that corresponds to the marker's location
                popupAnchor: [0, -32], // Point from which the popup should open
              })}
              position={[location.latitude, location.longitude]}
            />
            <CustomMapButtons location={location} />
          </MapContainer>
        )}
      </div>
      <div className="h-1" />
    </div>
  );
}

const CustomMapButtons = ({ location }: { location: Location }) => {
  const map = useMap();

  return (
    <div
      className="flex flex-col gap-3"
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: 1000,
      }}
    >
      <button
        onClick={() => map.flyTo([location.latitude, location.longitude], 18)}
        style={{
          padding: "8px 12px",
          background: "white",
          boxShadow: "0 1px 5px rgb(0, 0, 0, 0.65)",
          borderRadius: "5px",
          cursor: "pointer",
          width: "fit-content",
        }}
      >
        <Locate className="text-gray-700 h-5 w-5" />
      </button>
      <button
        onClick={() => map.flyTo([17.24644626457851, 78.6209296162973], 18)}
        style={{
          padding: "8px 12px",
          background: "white",
          boxShadow: "0 1px 5px rgb(0, 0, 0, 0.65)",
          borderRadius: "5px",
          cursor: "pointer",
          width: "fit-content",
        }}
      >
        <MapPin className="text-gray-700 h-5 w-5" />
      </button>
    </div>
  );
};
