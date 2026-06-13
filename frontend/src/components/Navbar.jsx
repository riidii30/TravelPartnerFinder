import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

function Navbar() {
  const [darkMode, setDarkMode] =
    useState(
      localStorage.getItem("theme") === "dark"
    );

  useEffect(() => {

    if (darkMode) {

      document.body.classList.add(
        "dark-mode"
      );

    } else {

      document.body.classList.remove(
        "dark-mode"
      );

    }

  }, [darkMode]);

  const navigate =
    useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const profileImage =
    localStorage.getItem("profileImage");


  const handleLogout =
    () => {
      localStorage.removeItem(
        "user"
      );

      navigate("/login");
    };

  const [
    notificationCount,
    setNotificationCount,
  ] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications =
    async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/notifications"
        );

        const unreadNotifications =
          res.data.filter(
            (item) => !item.is_read
          );

        setNotificationCount(
          unreadNotifications.length
        );
      } catch (error) {
        console.log(error);
      }
    };

  const toggleTheme = () => {

    const newTheme = !darkMode;

    setDarkMode(newTheme);

    localStorage.setItem(
      "theme",
      newTheme ? "dark" : "light"
    );
  };

  return (
    <nav className="navbar navbar-expand-lg py-3 shadow-sm">
      <div className="container">

        <Link
          to="/"
          className="text-decoration-none"
        >
          <h3
            className="m-0 fw-bold"
            style={{
              color:
                "var(--primary)",
            }}
          >
            TravelMate
          </h3>
        </Link>

        <div className="d-flex gap-4 align-items-center">

          <Link
            to="/"
            className="text-dark text-decoration-none"
          >
            Home
          </Link>

          <Link
            to="/discover"
            className="text-dark text-decoration-none"
          >
            Discover
          </Link>

          <Link
            to="/create-trip"
            className="text-dark text-decoration-none"
          >
            Create Trip
          </Link>

          <Link
            to="/my-trips"
            className="text-dark text-decoration-none"
          >
            My Trips
          </Link>

          <Link
            to="/notifications"
            className="text-dark text-decoration-none position-relative"
            style={{
              fontSize: "22px",
            }}
          >
            🔔

            {notificationCount >
              0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{
                    fontSize: "10px",
                    minWidth: "18px",
                    height: "18px",
                    lineHeight: "10px",
                    padding: "4px",
                  }}
                >
                  {
                    notificationCount
                  }
                </span>
              )}
          </Link>

          {user ? (

            <div className="dropdown position-relative">
              <img
                src={
                  profileImage ||
                  `https://ui-avatars.com/api/?name=${user?.name}`
                }
                alt="Profile"
                className="dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: "2px solid #A8C3B0",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
                }}
              />

              <ul
                className="dropdown-menu dropdown-menu-end"
                style={{
                  minWidth: "170px",
                  marginTop: "10px",
                  borderRadius: "16px",
                  border: "none",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.12)",
                  right: "0",
                  left: "auto"
                }}
              >
                <li>
                  <Link
                    className="dropdown-item"
                    to="/profile"
                  >
                    👤 My Profile
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item"
                    to="/my-trips"
                  >
                    ✈️ My Trips
                  </Link>
                </li>

                <li>
                  <button
                    className="dropdown-item"
                    onClick={toggleTheme}
                  >
                    {darkMode
                      ? "☀️ Light Mode"
                      : "🌙 Dark Mode"}
                  </button>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </li>

              </ul>

            </div>

          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-outline-secondary"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="btn btn-success"
              >
                Sign Up
              </Link>
            </>
          )}


        </div>
      </div>
    </nav>
  );
}

export default Navbar;