import MainLayout from "../layouts/MainLayout";
import { useState } from "react";
import axios from "axios";

function CreateTrip() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [interests, setInterests] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState("");
  const [aiPlan, setAiPlan] = useState("");
  const [tripImage, setTripImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const generateAIPlan =
    async () => {

      console.log(
        "Generate Button Clicked"
      );

      try {

        console.log(
          "Sending Request"
        );

        const res =
          await axios.post(
            "http://localhost:8000/generate-trip-plan",
            {
              destination,
              budget,
              days,
              interests,
            }
          );

        console.log(
          "Response:",
          res.data
        );

        setAiPlan(
          res.data.plan
        );

      } catch (error) {

        console.log(
          "FULL ERROR:",
          error
        );

        console.log(
          "ERROR RESPONSE:",
          error.response
        );

        console.log(
          "ERROR DATA:",
          error.response?.data
        );

        alert(
          "Failed to Generate AI Plan"
        );
      }
    };
  const handleCreateTrip = async () => {
    if (
      !destination ||
      !startDate ||
      !endDate ||
      !budget ||
      !interests ||
      !description
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        "destination",
        destination
      );

      formData.append(
        "startDate",
        startDate
      );

      formData.append(
        "endDate",
        endDate
      );

      formData.append(
        "budget",
        budget
      );

      formData.append(
        "interests",
        interests
      );

      formData.append(
        "description",
        description
      );

      formData.append(
        "userId",
        user.id
      );

      formData.append(
        "tripImage",
        tripImage
      );

      const res = await axios.post(
        "http://localhost:8000/create-trip",
        formData
      );

      alert(res.data.message);

      setDestination("");
      setStartDate("");
      setEndDate("");
      setBudget("");
      setInterests("");
      setDescription("");

      setTripImage("");
      setPreviewImage("");
    } catch (error) {
      console.log(error);
      alert("Trip Creation Failed");
    }
  };

  return (
    <MainLayout>
      <div className="container py-5">
        <h1 className="mb-4">
          Create New Trip
        </h1>

        <div className="card p-4 shadow-sm border-0 rounded-4">

          <div className="mb-3">
            <label className="form-label">
              Destination
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) =>
                setDestination(e.target.value)
              }
            />
          </div>

          <div className="row">

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Start Date
              </label>

              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                End Date
              </label>

              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
              />
            </div>

          </div>

          <div className="mb-3">
            <label className="form-label">
              Budget
            </label>

            <input
              type="number"
              className="form-control"
              placeholder="Enter budget"
              value={budget}
              onChange={(e) =>
                setBudget(e.target.value)
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Number of Days
            </label>

            <input
              type="number"
              className="form-control"
              placeholder="Enter number of days"
              value={days}
              onChange={(e) =>
                setDays(e.target.value)
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Interests
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Adventure, Beaches, Trekking"
              value={interests}
              onChange={(e) =>
                setInterests(e.target.value)
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Trip Image
            </label>

            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => {
                const file =
                  e.target.files[0];

                if (file) {
                  setTripImage(file);

                  const imageUrl =
                    URL.createObjectURL(file);

                  setPreviewImage(imageUrl);
                }
              }}
            />
          </div>

          {previewImage && (
            <div className="mb-3">

              <img
                src={previewImage}
                alt="Trip Preview"
                className="img-fluid rounded"
                style={{
                  maxHeight: "250px",
                  objectFit: "cover",
                }}
              />

            </div>
          )}

          <div className="mb-3">
            <label className="form-label">
              Description
            </label>

            <textarea
              rows="4"
              className="form-control"
              placeholder="Trip details..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            ></textarea>
          </div>

          <button
            className="btn ai-plan-btn w-100 mb-3"
            onClick={generateAIPlan}
          >
            Generate AI Plan
          </button>

          <button
            className="btn create-trip-btn w-100"
            onClick={handleCreateTrip}
          >
            🚀 Create Trip
          </button>

          {aiPlan && (
            <div className="mt-4 p-3 border rounded bg-light">
              <h5>
                🤖 AI Trip Plan
              </h5>

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                }}
              >
                {aiPlan}
              </pre>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}

export default CreateTrip;