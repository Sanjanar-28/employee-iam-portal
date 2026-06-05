import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCards from "../components/StatCards";

import "../styles/Dashboard.css";

function Dashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (

    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />

        <div className="dashboard-body">

          {user?.role === "Admin" ? (

            <StatCards />

          ) : (

           <div className="welcome-card">

  <h2>
    Welcome, {user?.name}
  </h2>

  <p>
    Role:
    <strong> {user?.role}</strong>
  </p>

  <p>
    Department:
    <strong> {user?.department}</strong>
  </p>

  <p>
    Access Level:
    <strong> Restricted User</strong>
  </p>

</div>

          )}

        </div>

      </div>

    </div>

  );
}

export default Dashboard;