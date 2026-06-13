import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [interests, setInterests] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/trips"
      );

      setTrips(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTrip = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/trip/${id}`
      );

      alert("Trip Deleted Successfully");

      fetchTrips();
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  const openEdit = (trip) => {
    setEditingTrip(trip);

    setDestination(trip.destination);
    setStartDate(trip.start_date?.split("T")[0]);
    setEndDate(trip.end_date?.split("T")[0]);
    setBudget(trip.budget);
    setInterests(trip.interests);
    setDescription(trip.description);
  };

  const updateTrip = async () => {
    try {
      await axios.put(
        `http://localhost:8000/trip/${editingTrip.id}`,
        {
          destination,
          startDate,
          endDate,
          budget,
          interests,
          description,
        }
      );

      alert("Trip Updated Successfully");

      setEditingTrip(null);

      fetchTrips();
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  return (
    <MainLayout>
      <div className="container py-5">

        <h1 className="mb-4">
          My Trips
        </h1>

        <div className="row">

          {trips.length === 0 ? (
            <h5>No Trips Found</h5>
          ) : (
            trips.map((trip) => (
              <div
                className="col-md-4 mb-4"
                key={trip.id}
              >
                <div className="card border-0 shadow-sm rounded-4 p-4">
                  {trip.trip_image && (
                    <img
                      src={`http://localhost:8000${trip.trip_image}`}
                      alt={trip.destination}
                      className="img-fluid rounded mb-3"
                      style={{
                        height: "220px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <h4>{trip.destination}</h4>

                  <p>
                    📅{" "}
                    {new Date(
                      trip.start_date
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    💰 ₹{trip.budget}
                  </p>

                  <p>
                    🎯 {trip.interests}
                  </p>

                  <div className="d-flex gap-2">

                    <button
                      className="btn"
                      onClick={() => openEdit(trip)}
                      style={{
                        background: "#A8C3B0",
                        color: "white",
                        border: "none",
                        borderRadius: "12px"
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="btn"
                      onClick={() => deleteTrip(trip.id)}
                      style={{
                        background: "#d7e4da",
                        color: "#5f7a67",
                        border: "none",
                        borderRadius: "12px"
                      }}
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>
              </div>
            ))
          )}

        </div>

        {editingTrip && (
          <div className="card p-4 mt-4 shadow-sm border-0 rounded-4">
            {editingTrip?.trip_image && (
              <img
                src={`http://localhost:8000${editingTrip.trip_image}`}
                alt={editingTrip.destination}
                className="img-fluid rounded mb-3"
                style={{
                  height: "220px",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            )}

            <h3 className="mb-4">
              Edit Trip
            </h3>

            <input
              type="text"
              className="form-control mb-3"
              value={destination}
              onChange={(e) =>
                setDestination(e.target.value)
              }
            />

            <input
              type="date"
              className="form-control mb-3"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
            />

            <input
              type="date"
              className="form-control mb-3"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
            />

            <input
              type="text"
              className="form-control mb-3"
              value={budget}
              onChange={(e) =>
                setBudget(e.target.value)
              }
            />

            <input
              type="text"
              className="form-control mb-3"
              value={interests}
              onChange={(e) =>
                setInterests(e.target.value)
              }
            />

            <textarea
              rows="4"
              className="form-control mb-3"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

            <div className="d-flex gap-2">

              <button
                className="btn"
                style={{
                  background: "#A8C3B0",
                  color: "white",
                  border: "none",
                  borderRadius: "12px"
                }} onClick={updateTrip}
              >
                Save Changes
              </button>

              <button
                className="btn"
                style={{
                  background: "#e8f0ea",
                  color: "#5f7a67",
                  border: "none",
                  borderRadius: "12px"
                }} onClick={() =>
                  setEditingTrip(null)
                }
              >
                Cancel
              </button>

            </div>

          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default MyTrips;