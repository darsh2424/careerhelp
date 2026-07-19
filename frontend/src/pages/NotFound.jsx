import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="p-10 text-center">

      <h1 className="text-5xl font-bold">
        404
      </h1>

      <p>Page Not Found</p>
      <span className="text-gray-500">The page you are looking for does not exist.</span><br/>
      <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
        Go back to Home
      </Link>
    </div>
  );
}