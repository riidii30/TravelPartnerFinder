import { useState, useEffect } from "react";
import axios from "axios";

import MainLayout from "../layouts/MainLayout";
import TripCard from "../components/TripCard";

import { useSearchParams } from "react-router-dom";

function Discover() {
  const [searchParams] = useSearchParams();
  useEffect(() => {
    fetchTrips();

    const destination =
      searchParams.get("destination");

    if (destination) {
      setSearch(destination);
    }
  }, []);
  const [search, setSearch] = useState("");
  const [trips, setTrips] = useState([]);

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

  const handleRequest = async (tripId) => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      await axios.post(
        "http://localhost:8000/request-trip",
        {
          tripId,
          senderName: user.name,
        }
      );

      alert("Request Sent Successfully");
    } catch (error) {
      console.log(error);
      alert("Request Failed");
    }
  };

  const filteredTrips = trips.filter((trip) =>
    trip.destination
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container py-3 mt-2 page-container">
        <div className="mb-3">
          <h1 className="fw-bold">
            Discover Trips
          </h1>

          <p className="text-muted">
            Explore trips created by travelers and join them.
          </p>
        </div>

        <div className="mb-4">
          <input
            type="text"
            className="form-control form-control-lg discover-search"
            placeholder="🔍 Search destination..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="row">

          {filteredTrips.length === 0 ? (
            <div className="text-center py-5">
              <h4>No Trips Found</h4>

              <p className="text-muted">
                Try another destination.
              </p>
            </div>
          ) : (
            filteredTrips.map((trip) => (
              <div
                className="col-lg-6 col-md-6 mb-4"
                key={trip.id}
              >
                <TripCard
                  trip={trip}
                  onRequest={handleRequest}
                />
              </div>
            ))
          )}

        </div>

      </div>
    </MainLayout>
  );
}

export default Discover;