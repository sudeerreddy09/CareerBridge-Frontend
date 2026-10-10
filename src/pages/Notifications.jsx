import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Notifications() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("careerbridgeUser");

    if (!storedUser) {
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    fetch(
      `https://careerbridge-backend-rw9x.onrender.com/api/notifications/user/${parsedUser.id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load notifications");
        }

        return response.json();
      })
      .then((data) => {
        setNotifications(data);
      })
      .catch((error) => {
        console.error(error);
        setMessage("Unable to load notifications.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const notifySidebar = () => {
    window.dispatchEvent(
      new Event("notificationsUpdated")
    );
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `https://careerbridge-backend-rw9x.onrender.com/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to mark notification as read"
        );
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );

      notifySidebar();
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `https://careerbridge-backend-rw9x.onrender.com/api/notifications/user/${user.id}/read-all`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to mark notifications as read"
        );
      }

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read: true,
        }))
      );

      notifySidebar();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(
        `https://careerbridge-backend-rw9x.onrender.com/api/notifications/${notificationId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete notification"
        );
      }

      setNotifications((previous) =>
        previous.filter(
          (notification) =>
            notification.id !== notificationId
        )
      );

      notifySidebar();
    } catch (error) {
      console.error(error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "JOB":
        return "💼";

      case "APPLICATION":
        return "📝";

      case "COURSE":
        return "📚";

      case "ASSESSMENT":
        return "🎯";

      case "SUCCESS":
        return "🏆";

      default:
        return "🔔";
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  if (!user) {
    return (
      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <div className="dashboard-content">
            <div className="notifications-empty">
              <strong>
                Please log in to view your notifications.
              </strong>

              <Link to="/login">
                Go to Login
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="dashboard-content notifications-page">

          <div className="page-header notifications-header">
            <div>
              <span className="page-eyebrow">
                CAREERBRIDGE UPDATES
              </span>

              <h1>Notifications</h1>

              <p>
                Stay updated with your career journey,
                applications, learning progress and
                opportunities.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                className="notifications-mark-all"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          {message && (
            <div className="notifications-message">
              {message}
            </div>
          )}

          {!loading &&
            notifications.length > 0 && (
              <div className="notifications-summary">
                <span>
                  {notifications.length}{" "}
                  {notifications.length === 1
                    ? "notification"
                    : "notifications"}
                </span>

                {unreadCount > 0 ? (
                  <strong>
                    {unreadCount} unread
                  </strong>
                ) : (
                  <strong>
                    All caught up
                  </strong>
                )}
              </div>
            )}

          {loading ? (
            <div className="notifications-loading">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="notifications-empty">

              <div className="notifications-empty-icon">
                🔔
              </div>

              <h2>No notifications yet</h2>

              <p>
                Your CareerBridge updates will appear
                here as you complete assessments,
                courses and job applications.
              </p>

              <Link to="/dashboard">
                Back to Dashboard
              </Link>

            </div>
          ) : (
            <div className="notifications-list">

              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-card ${
                    notification.read
                      ? "notification-read"
                      : "notification-unread"
                  }`}
                >

                  <div className="notification-icon">
                    {getIcon(notification.type)}
                  </div>

                  <div className="notification-content">

                    <div className="notification-top">

                      <div>
                        <span className="notification-type">
                          {notification.type ||
                            "UPDATE"}
                        </span>

                        <h3>
                          {notification.title}
                        </h3>
                      </div>

                      {!notification.read && (
                        <span className="notification-dot">
                          NEW
                        </span>
                      )}

                    </div>

                    <p>
                      {notification.message}
                    </p>

                    <span className="notification-date">
                      {formatDate(
                        notification.createdAt
                      )}
                    </span>

                    <div className="notification-actions">

                      {!notification.read && (
                        <button
                          onClick={() =>
                            markAsRead(
                              notification.id
                            )
                          }
                        >
                          Mark as read
                        </button>
                      )}

                      <button
                        onClick={() =>
                          deleteNotification(
                            notification.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Notifications;