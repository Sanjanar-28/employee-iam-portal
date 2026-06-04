import { useEffect, useState } from "react";
import api from "../services/api";
import "./../styles/StatCards.css";

function StatCards() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    admins: 0
  });

  useEffect(() => {

    if (user?.role !== "Admin") {
      return;
    }

    const fetchStats = async () => {

      try {

        const token =
          localStorage.getItem("token");

        const response = await api.get(
          "/users/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setStats(response.data);

      } catch (error) {

        console.error(
          "Error fetching stats:",
          error
        );

      }

    };

    fetchStats();

  }, []);

  if (user?.role !== "Admin") {
    return null;
  }

  return (

    <div className="stats-grid">

      <div className="stat-card">
        <h2>{stats.totalUsers}</h2>
        <p>Total Users</p>
      </div>

      <div className="stat-card">
        <h2>{stats.activeUsers}</h2>
        <p>Active Users</p>
      </div>

      <div className="stat-card">
        <h2>{stats.inactiveUsers}</h2>
        <p>Inactive Users</p>
      </div>

      <div className="stat-card">
        <h2>{stats.admins}</h2>
        <p>Admins</p>
      </div>

    </div>

  );
}

export default StatCards;