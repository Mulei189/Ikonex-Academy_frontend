import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getClassStreamById } from "../services/classStreams";

export default function ClassStreamDetails() {
  const { id } = useParams();

  const [stream, setStream] = useState(null);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const response =
          await getClassStreamById(id);

        setStream(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!stream) {
    return (
      <p>Class stream not found.</p>
    );
  }

  return (
    <div>
      <h1>Class Stream Details</h1>

      <div className="card">
        <p>
          <strong>ID:</strong>{" "}
          {stream.id}
        </p>

        <p>
          <strong>Stream Code:</strong>{" "}
          {stream.streamCode}
        </p>

        <p>
          <strong>Name:</strong>{" "}
          {stream.name}
        </p>

        <p>
          <strong>Created:</strong>{" "}
          {new Date(
            stream.createdAt
          ).toLocaleString()}
        </p>
      </div>
    </div>
  );
}