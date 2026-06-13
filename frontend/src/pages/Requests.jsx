import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Requests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/requests"
      );

      setRequests(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateRequest = async (
    id,
    status
  ) => {
    try {
      await axios.put(
        `http://localhost:8000/request/${id}`,
        {
          status,
        }
      );

      alert(`Request ${status}`);
      fetchRequests();
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  return (
    <MainLayout>
      <div className="container py-5">

        <h1 className="mb-4">
          Trip Requests
        </h1>

        {requests.length === 0 ? (
          <h5>No Requests Found</h5>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="card p-4 mb-3 shadow-sm border-0 rounded-4"
            >
              <h5 className="fw-bold">
                {request.sender_name}
              </h5>

              <p className="mb-2">
                Trip ID: {request.trip_id}
              </p>

              <p className="mb-3">
                Status:{" "}
                <strong>
                  {request.status}
                </strong>
              </p>

              {/* Pending Request */}
              {request.status ===
                "pending" && (
                  <div className="d-flex gap-2">

                    <button
                      className="btn btn-success"
                      onClick={() =>
                        updateRequest(
                          request.id,
                          "accepted"
                        )
                      }
                    >
                      Accept
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        updateRequest(
                          request.id,
                          "rejected"
                        )
                      }
                    >
                      Reject
                    </button>

                  </div>
                )}

              {/* Accepted Request */}
              {request.status ===
                "accepted" && (
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(
                        `/chat/${request.id}`
                      )
                    }
                  >
                    Open Chat
                  </button>
                )}

            </div>
          ))
        )}

      </div>
    </MainLayout>
  );
}

export default Requests;