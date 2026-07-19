import { useParams } from "react-router-dom";

export default function JobDetail() {
  const { id } = useParams();

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">
        Job Detail
      </h1>

      <p>Job ID : {id}</p>
    </div>
  );
}