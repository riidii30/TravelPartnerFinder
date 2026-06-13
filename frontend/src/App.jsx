import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreateTrip from "./pages/CreateTrip";
import MyTrips from "./pages/MyTrips";
import Requests from "./pages/Requests";
import Chat from "./pages/Chat";
import ForgotPassword from "./pages/ForgotPassword";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
      />
      <Route path="/create-trip" element={
        <ProtectedRoute>
          <CreateTrip />
        </ProtectedRoute>
      }
      />
      <Route path="/my-trips" element={
        <ProtectedRoute>
          <MyTrips />
        </ProtectedRoute>
      }
      />
      <Route path="/requests" element={
        <ProtectedRoute>
          <Requests />
        </ProtectedRoute>
      }
      />
      <Route path="/chat/:requestId" element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      }
      />
    </Routes>
  );
}

export default App;