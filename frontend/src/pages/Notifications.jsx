import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/notifications"
      );

      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:8000/notifications/${id}/read`
      );

      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <div className="container py-5">

        <h1 className="mb-4">
          🔔 Notifications
        </h1>

        {notifications.length === 0 ? (
          <h5>No Notifications</h5>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="card p-3 mb-3 shadow-sm border-0 rounded-4"
            >
              <h6>{item.message}</h6>

              <small className="text-muted">
                {new Date(
                  item.created_at
                ).toLocaleString()}
              </small>

              <div className="mt-2">

                {item.is_read ? (
                  <span className="badge bg-success">
                    Read
                  </span>
                ) : (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      markAsRead(item.id)
                    }
                  >
                    Mark As Read
                  </button>
                )}

              </div>
            </div>
          ))
        )}

      </div>
    </MainLayout>
  );
}

export default Notifications;