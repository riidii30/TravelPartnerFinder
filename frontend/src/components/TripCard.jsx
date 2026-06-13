function TripCard({
  trip,
  onRequest,
}) {
  return (
    <div className="card border-0 shadow-sm h-100">
      {trip.trip_image && (
        <img
          src={`http://localhost:8000${trip.trip_image}`}
          alt={trip.destination}
          className="card-img-top"
          style={{
            height: "220px",
            objectFit: "cover",
          }}
        />
      )}
      <div className="card-body p-4">

        <h4 className="fw-bold">
          {trip.destination}
        </h4>

        <p>
          📅 {new Date(
            trip.start_date
          ).toLocaleDateString()}
        </p>

        <p>
          💰 ₹{trip.budget}
        </p>

        <p>
          🎯 {trip.interests}
        </p>

        <p>
          📝 {trip.description}
        </p>

        <button
          className="btn btn-success w-100"
          onClick={() =>
            onRequest(trip.id)
          }
        >
          Request To Join
        </button>

      </div>
    </div>
  );
}

export default TripCard;