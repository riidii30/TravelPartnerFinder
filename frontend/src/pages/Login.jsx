import MainLayout from "../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom"; import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/login",
        {
          email,
          password,
        }
      );

      alert(res.data.message);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/profile");

      console.log("Logged In User:", res.data.user);
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Login Failed");
      }
    }
  };

  return (
    <MainLayout>
      <div
        className="container py-5"
        style={{
          minHeight: "80vh"
        }}
      >
        <div className="row justify-content-center w-100">
          <div className="col-lg-6 col-md-8">
            <div
              className="card border-0 shadow-sm p-5"
              style={{
                borderRadius: "24px"
              }}
            >
              <div className="text-center mb-4">
                <h1 className="fw-bold">
                  Welcome Back 👋
                </h1>

                <p className="text-muted">
                  Login to continue your travel journey.
                </p>
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

              <div className="mb-4">
                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />
              </div>

              <div className="text-end mb-3">
                <Link
                  to="/forgot-password"
                  className="text-decoration-none"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                className="btn btn-success w-100 mb-3"
                onClick={handleLogin}
              >
                Login
              </button>

              <div className="text-center">
                <span className="text-muted">
                  Don't have an account?
                </span>

                <Link
                  to="/signup"
                  className="text-decoration-none ms-2"
                >
                  Sign Up
                </Link>
              </div>

            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Login;