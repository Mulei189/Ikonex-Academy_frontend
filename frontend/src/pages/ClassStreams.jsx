import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getClassStreams,
  createClassStream,
  deleteClassStream,
} from "../services/classStreams";

export default function ClassStreams() {
  const [streams, setStreams] = useState([]);

  const [formData, setFormData] = useState({
    streamCode: "",
    name: "",
  });

  const loadStreams = async () => {
    try {
      const streams = await getClassStreams();

      setStreams(streams);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadStreams();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createClassStream(formData);

      setFormData({
        streamCode: "",
        name: "",
      });

      loadStreams();
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Failed to create stream"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this class stream?"
    );

    if (!confirmed) return;

    try {
      await deleteClassStream(id);

      loadStreams();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="page-title">
        Class Streams
      </h1>

      <form
        className="form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="streamCode"
          placeholder="F1A"
          value={formData.streamCode}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="name"
          placeholder="Form 1A"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Add Stream
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Stream Code</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {streams.map((stream) => (
            <tr key={stream.id}>
              <td>{stream.streamCode}</td>

              <td>{stream.name}</td>

              <td>
                <Link to={`/class-streams/${stream.id}`}>
                    View
                </Link>
                <button
                  onClick={() =>
                    handleDelete(
                      stream.id
                    )
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}