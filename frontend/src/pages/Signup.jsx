import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (
      !name ||
      !email ||
      !city ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/signup",
        {
          name,
          email,
          password,
        }
      );

      alert(res.data.message);

      setName("");
      setEmail("");
      setCity("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error);
      alert("Signup Failed");
    }
  };

  return (
    <MainLayout>
      <div className="container py-5">

        <div className="row justify-content-center">

          <div className="col-lg-6 col-md-8">

            <div
              className="card border-0 shadow-sm p-5"
              style={{
                borderRadius: "24px"
              }}
            >
              <div className="text-center mb-4">

                <h1 className="fw-bold">
                  Create Account 🌿
                </h1>

                <p className="text-muted">
                  Join TravelMate and start your next adventure.
                </p>

              </div>

              <div className="mb-3">
                <label className="form-label">
                  Full Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Email Address
                </label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  City
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your city"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />
              </div>

              <div className="mb-4">
                <label className="form-label">
                  Confirm Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />
              </div>

              <button
                className="btn btn-success w-100 mb-3"
                onClick={handleSignup}
              >
                Create Account
              </button>

              <div className="text-center">

                <span className="text-muted">
                  Already have an account?
                </span>

                <Link
                  to="/login"
                  className="text-decoration-none ms-2"
                >
                  Login
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Signup;