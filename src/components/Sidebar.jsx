import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      const storedUser =
        localStorage.getItem("careerbridgeUser");

      if (!storedUser) {
        setUnreadCount(0);
        return;
      }

      try {
        const user = JSON.parse(storedUser);

        const response = await fetch(
          `https://careerbridge-backend-rw9x.onrender.com/api/notifications/user/${user.id}/unread-count`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load notification count"
          );
        }

        const count = await response.json();

        setUnreadCount(count);
      } catch (error) {
        console.error(
          "Notification count error:",
          error
        );
      }
    };

    loadUnreadCount();

    const handleNotificationsUpdated = () => {
      loadUnreadCount();
    };

    window.addEventListener(
      "notificationsUpdated",
      handleNotificationsUpdated
    );

    const interval = setInterval(
      loadUnreadCount,
      30000
    );

    return () => {
      clearInterval(interval);

      window.removeEventListener(
        "notificationsUpdated",
        handleNotificationsUpdated
      );
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("careerbridgeUser");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path;

  return (
    <aside className="dashboard-sidebar">

      <Link
        to="/"
        className="dashboard-brand"
      >
        <div className="brand-mark">
          C
        </div>

        <div className="brand-text">
          <span>Career</span>Bridge
        </div>
      </Link>

      <div className="sidebar-section">

        <p className="sidebar-label">
          WORKSPACE
        </p>

        <Link
          to="/dashboard"
          className={`sidebar-link ${
            isActive("/dashboard")
              ? "active"
              : ""
          }`}
        >
          <span>⌂</span>
          Dashboard
        </Link>

        <Link
          to="/assessment"
          className={`sidebar-link ${
            isActive("/assessment")
              ? "active"
              : ""
          }`}
        >
          <span>◈</span>
          Career Assessment
        </Link>

        <Link
          to="/learning"
          className={`sidebar-link ${
            isActive("/learning") ||
            location.pathname.startsWith(
              "/learning/course/"
            )
              ? "active"
              : ""
          }`}
        >
          <span>▣</span>
          Learning
        </Link>

        <Link
          to="/jobs"
          className={`sidebar-link ${
            isActive("/jobs") ||
            location.pathname.startsWith(
              "/jobs/"
            )
              ? "active"
              : ""
          }`}
        >
          <span>⌕</span>
          Jobs
        </Link>

        <Link
          to="/saved-jobs"
          className={`sidebar-link ${
            isActive("/saved-jobs")
              ? "active"
              : ""
          }`}
        >
          <span>♥</span>
          Saved Jobs
        </Link>

        <Link
          to="/applications"
          className={`sidebar-link ${
            isActive("/applications")
              ? "active"
              : ""
          }`}
        >
          <span>▤</span>
          Applications
        </Link>

        <Link
          to="/notifications"
          className={`sidebar-link ${
            isActive("/notifications")
              ? "active"
              : ""
          }`}
        >
          <span>♢</span>
          Notifications

          {unreadCount > 0 && (
            <span className="notification-sidebar-badge">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}
        </Link>

        <Link
          to="/progress"
          className={`sidebar-link ${
            isActive("/progress")
              ? "active"
              : ""
          }`}
        >
          <span>↗</span>
          Progress
        </Link>

      </div>

      <div className="sidebar-section">

        <p className="sidebar-label">
          ACCOUNT
        </p>

        <Link
          to="/profile"
          className={`sidebar-link ${
            isActive("/profile")
              ? "active"
              : ""
          }`}
        >
          <span>◎</span>
          Profile
        </Link>

        <Link
          to="/portfolio"
          className={`sidebar-link ${
            isActive("/portfolio")
              ? "active"
              : ""
          }`}
        >
          <span>▣</span>
          Portfolio
        </Link>

      </div>

      <div className="sidebar-bottom">

        <div className="sidebar-help">

          <strong>
            Need guidance?
          </strong>

          <span>
            Explore your career path
          </span>

          <Link to="/assessment">
            Start Assessment →
          </Link>

        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;