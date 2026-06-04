import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");

  };

  return (

    <div className="sidebar">

      <div>

        <div className="sidebar-logo">
          🛡️
          <span>IAM Portal</span>
        </div>

        <ul className="sidebar-menu">

          <li
            className={
              location.pathname === "/dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Dashboard
          </li>

          <li
            className={
              location.pathname === "/users"
                ? "active"
                : ""
            }
            onClick={() =>
              navigate("/users")
            }
          >
            Users
          </li>

          <li
            className={
              location.pathname === "/audit-logs"
                ? "active"
                : ""
            }
            onClick={() =>
              navigate("/audit-logs")
            }
          >
            Audit Logs
          </li>

        </ul>

      </div>

      <button
        className="logout-btn"
        onClick={logout}
      >
        Logout
      </button>

    </div>

  );
}

export default Sidebar;