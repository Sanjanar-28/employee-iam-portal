import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AuditLogs.css";
function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token =
          localStorage.getItem("token");
        const response = await api.get(
          "/users/audit/logs",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );
        setLogs(response.data);
      } catch (error) {

        console.error(
          "Error fetching logs:",
          error
        );
      }
    };
    if (
      currentUser?.role === "Admin"
    ) {
      fetchLogs();
    }
  }, []);
  if (
    currentUser?.role !== "Admin"
  ) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        <div className="dashboard-body">
          <div className="audit-header">
            <h1>Audit Logs</h1>
            <p>
              Track all user activities
              across the IAM system
            </p>
          </div>
          <div className="audit-card">
            <table>
              <thead>
                <tr>
                 <th>Performed By</th>
<th>Action</th>
<th>Target User</th>
<th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td>
  {log.performedBy}
</td>

<td>
  <span className="action-badge">
    {log.action}
  </span>
</td>

<td>
  {log.targetUser}
</td>

<td>
  {
    new Date(
      log.timestamp
    ).toLocaleString()
  }
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AuditLogs;