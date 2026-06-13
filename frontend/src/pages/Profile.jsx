import MainLayout from "../layouts/MainLayout";
import goa from "../assets/goa.webp";
import { useState } from "react";
import axios from "axios";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "/login";
    return null;
  }
  const [isEditing, setIsEditing] =
    useState(false);

  const [name, setName] =
    useState(user?.name || "");

  const [email, setEmail] =
    useState(user?.email || "");

  const [bio, setBio] =
    useState(user?.bio || "");

  const [phone, setPhone] =
    useState(user?.phone || "");

  const [city, setCity] =
    useState(user?.city || "");

  const [interests, setInterests] =
    useState(user?.interests || "");

  const updateProfile = async () => {
    try {
      await axios.put(
        "http://localhost:8000/update-profile",
        {
          id: user.id,
          name,
          email,
          bio,
          phone,
          city,
          interests,
        }
      );

      const updatedUser = {
        ...user,
        name,
        email,
        bio,
        phone,
        city,
        interests,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      alert(
        "Profile Updated Successfully"
      );

      window.location.reload();
    } catch (error) {
      console.log(error);

      alert(
        "Profile Update Failed"
      );
    }
  };

  const [profileImage, setProfileImage] =
    useState(
      localStorage.getItem(
        "profileImage"
      ) || goa
    );

  return (
    <MainLayout>
      <div className="container py-5 mt-3">

        <div
          className="card border-0 shadow-sm p-4 mx-auto"
          style={{
            borderRadius: "24px",
            maxWidth: "1100px"
          }}
        >
          <div className="row align-items-center">

            <div className="col-lg-3 text-center mb-4 mb-lg-0">
              <img
                src={profileImage}
                alt="Profile"
                className="img-fluid rounded-circle shadow"
                style={{
                  width: "220px",
                  height: "220px",
                  objectFit: "cover",
                  border: "4px solid #A8C3B0"
                }}
              />

              <input
                type="file"
                className="form-control mt-3"
                accept="image/*"
                onChange={(e) => {
                  const file =
                    e.target.files[0];

                  if (file) {
                    const imageUrl =
                      URL.createObjectURL(file);

                    setProfileImage(imageUrl);

                    localStorage.setItem(
                      "profileImage",
                      imageUrl
                    );
                  }
                }}
              />
            </div>

            <div className="col-lg-9">

              <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">

                <div>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        className="form-control mb-2"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        placeholder="Name"
                      />

                      <input
                        type="email"
                        className="form-control mb-2"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="Email"
                      />

                      <textarea
                        className="form-control"
                        rows="3"
                        value={bio}
                        onChange={(e) =>
                          setBio(e.target.value)
                        }
                        placeholder="Write your bio..."
                      />

                      <input
                        type="text"
                        className="form-control mt-2"
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value)
                        }
                        placeholder="Phone Number"
                      />

                      <input
                        type="text"
                        className="form-control mt-2"
                        value={city}
                        onChange={(e) =>
                          setCity(e.target.value)
                        }
                        placeholder="City"
                      />

                      <input
                        type="text"
                        className="form-control mt-2"
                        value={interests}
                        onChange={(e) =>
                          setInterests(e.target.value)
                        }
                        placeholder="Photography, Beaches, Trekking"
                      />

                    </>
                  ) : (
                    <>
                      <h2 className="fw-bold mb-1">
                        {user?.name || "Traveler"}
                      </h2>

                      <p className="text-muted mb-0">
                        📧 {user?.email || "No Email"}
                      </p>

                      <p className="mt-2">
                        {user?.bio || "No bio added"}
                      </p>

                      <p className="mb-1">
                        📞 {user?.phone || "Not Added"}
                      </p>

                      <p className="mb-1">
                        📍 {user?.city || "Not Added"}
                      </p>

                      <p>
                        🎯 {user?.interests || "Not Added"}
                      </p>

                    </>
                  )}
                </div>

                <div className="mt-3 mt-lg-0">
                  {isEditing && (
                    <button
                      className="btn btn-success rounded-pill px-4 me-2"
                      style={{
                        background: "#A8C3B0",
                        border: "none"
                      }} onClick={updateProfile}
                    >
                      Save Changes
                    </button>
                  )}

                  <button
                    className={
                      isEditing
                        ? "btn btn-outline-secondary rounded-pill px-4 me-2"
                        : "btn btn-success rounded-pill px-4 me-2"
                    }
                    onClick={() =>
                      setIsEditing(!isEditing)
                    }
                  >
                    {isEditing
                      ? "Cancel"
                      : "Edit Profile"}
                  </button>

                  <button
                    className="btn btn-success rounded-pill px-4"
                    style={{
                      background: "#A8C3B0",
                      border: "none"
                    }} onClick={() => {
                      localStorage.removeItem("user");
                      window.location.href = "/login";
                    }}
                  >
                    Logout
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </MainLayout >
  );
}

export default Profile;