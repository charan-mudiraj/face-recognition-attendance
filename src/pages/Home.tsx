import { Button } from "primereact/button";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center m-10 gap-10">
      <Button onClick={() => navigate("/camera")} label="Camera" />
      <Button onClick={() => navigate("/location")} label="Location" />
    </div>
  );
}
