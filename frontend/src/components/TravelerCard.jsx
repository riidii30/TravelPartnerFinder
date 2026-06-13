function TravelerCard({
  name,
  city,
  destination,
  image,
  interest,
  match
}) {
  return (
    <div
      className="card border-0 h-100 overflow-hidden"
      style={{
        borderRadius: "24px",
        transition: "all 0.3s ease",
        cursor: "pointer"
      }}
    >
      <img
        src={image}
        alt={name}
        className="card-img-top"
        style={{
          height: "260px",
          objectFit: "cover"
        }}
      />

      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="fw-bold m-0">
            {name}
          </h5>

          <span className="badge bg-success">
            🔥 {match}% Match
          </span>
        </div>

        <p className="text-muted mb-2">
          📍 {city}
        </p>

        <p className="mb-2">
          ✈️ Going to <strong>{destination}</strong>
        </p>

        <p className="mb-3">
          🎒 {interest}
        </p>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary flex-fill">
            View Profile
          </button>

          <button className="btn btn-success flex-fill">
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}

export default TravelerCard;