import MainLayout from "../layouts/MainLayout";
import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] =
    useState("");

  const resetPassword = async () => {
    if (!email || !newPassword) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/forgot-password",
        {
          email,
          newPassword,
        }
      );

      alert(res.data.message);

      setEmail("");
      setNewPassword("");
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Password Reset Failed");
      }
    }
  };

  return (
    <MainLayout>
      <div className="container py-5">

        <div className="row justify-content-center">

          <div className="col-md-6">

            <div className="card p-4 shadow-sm border-0 rounded-4">

              <h2 className="mb-4">
                Forgot Password
              </h2>

              <input
                type="email"
                className="form-control mb-3"
                placeholder="Enter Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
              />

              <button
                className="btn btn-success"
                onClick={resetPassword}
              >
                Reset Password
              </button>

            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default ForgotPassword;