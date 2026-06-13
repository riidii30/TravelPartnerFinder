import goa from "../assets/goa.webp";
import manali from "../assets/manali.jpg";
import jaipur from "../assets/jaipur.jpg";
import kerala from "../assets/kerala.jpg";
import leh from "../assets/leh.jpg";
import rishikesh from "../assets/rishikesh.webp";
import { Link } from "react-router-dom";

function DestinationCards() {
  const places = [
    { name: "Goa", image: goa, search: "Goa" },
    { name: "Manali", image: manali, search: "Manali" },
    { name: "Jaipur", image: jaipur, search: "Jaipur" },
    { name: "Rishikesh", image: rishikesh, search: "Rishikesh" },
    { name: "Kerala", image: kerala, search: "Kerala" },
    { name: "Leh", image: leh, search: "Leh" },
  ];

  return (
    <section className="container py-5">
      <h2 className="mb-4">Popular Destinations</h2>

      <div className="row">
        {places.map((place) => (
          <div className="col-md-4 mb-4" key={place.name}>
            <div
              className="card shadow-sm overflow-hidden"
              style={{
                borderRadius: "20px",
              }}
            >
              <img
                src={place.image}
                alt={place.name}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />

              <div className="p-3">
                <h4>{place.name}</h4>

                <p>
                  Find travel partners heading to {place.name}.
                </p>

                <Link
                  to={`/discover?destination=${place.search}`}
                  className="btn btn-success"
                >
                  Explore
                </Link>

              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DestinationCards;