import useLocationDetector from "../hooks/useLocationDetector";
import React, { useRef } from "react";
import { Position } from "geojson";
import Input from "../components/Input";
import { Button } from "primereact/button";

export default function LocationDetector() {
  const { isInLocation, location, storePolygonBounds, polygonBounds } =
    useLocationDetector();
  const boundsRef = useRef<Position[][]>(polygonBounds);

  const onBoundValueChange = (
    index: number,
    value: number,
    type: "lat" | "lon"
  ) => {
    boundsRef.current[0][index][type === "lon" ? 0 : 1] = value;
  };

  return (
    <div className="space-y-10">
      <form
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
      </form>
      <div>
        <p>Is Inside : {isInLocation ? "Yes" : "No"}</p>
        <p>latitude: {location.latitude}</p>
        <p>longitude: {location.longitude}</p>
        <p>accuracy: {location.accuracy}</p>
      </div>
    </div>
  );
}
