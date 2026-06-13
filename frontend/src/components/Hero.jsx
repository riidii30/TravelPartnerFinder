import travelers from "../assets/travelers.jpg";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="container py-5 mt-4 hero-section">
      <div className="row align-items-center g-5">

        <div className="col-lg-6">
          <span
            className="px-3 py-2 rounded-pill"
            style={{
              background: "#F6E7E7",
              color: "#8FAE9D",
              fontWeight: "600",
              fontSize: "0.9rem"
            }}
          >
            ✈️ Travel Across India
          </span>

          <h1
            className="fw-bold mt-4 hero-title"
            style={{
              fontSize: "4rem",
              lineHeight: "1.1",
              color: "var(--text)"
            }}
          >
            Find Your Perfect
            <br />
            Travel Partner
          </h1>

          <p
            className="mt-4"
            style={{
              fontSize: "1.2rem",
              color: "#6b7280",
              maxWidth: "550px"
            }}
          >
            Connect with like-minded travelers across India,
            plan memorable adventures together, and discover
            amazing destinations with people who share your interests.
          </p>

          <div className="mt-4 d-flex gap-3 flex-wrap">

            <Link
              to="/discover"
              className="btn btn-success btn-lg"
            >
              Find Partners
            </Link>

            <Link
              to="/create-trip"
              className="btn btn-outline-secondary btn-lg"
            >
              Create Trip
            </Link>

          </div>

          <div className="mt-5 d-flex gap-5">

            <div>
              <h4 className="fw-bold m-0">
                500+
              </h4>

              <small className="text-muted">
                Travelers
              </small>
            </div>

            <div>
              <h4 className="fw-bold m-0">
                100+
              </h4>

              <small className="text-muted">
                Destinations
              </small>
            </div>

            <div>
              <h4 className="fw-bold m-0">
                1000+
              </h4>

              <small className="text-muted">
                Trips Planned
              </small>
            </div>

          </div>
        </div>

        <div className="col-lg-6 d-flex justify-content-end">
          <img
            src={travelers}
            alt="Travel Partner"
            className="img-fluid shadow hero-image"
            style={{
              borderRadius: "32px",
              width: "90%",
              height: "600px",
              objectFit: "cover"
            }}
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;