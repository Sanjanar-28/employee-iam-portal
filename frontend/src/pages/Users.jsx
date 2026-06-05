import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Users.css";

function Users() {

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] =
  useState(false);
  const [showPassword, setShowPassword] =
  useState(false);

const [newUser, setNewUser] =
  useState({
    name: "",
    email: "",
    password: "",
    role: "Developer",
    department: ""
  });
  const [showEditModal, setShowEditModal] =
  useState(false);

const [editingUser, setEditingUser] =
  useState(null);
  

  const [search, setSearch] = useState("");

  const [role, setRole] = useState("");

  const [status, setStatus] = useState("all");
  const currentUser = JSON.parse(
  localStorage.getItem("user")
);
  const deleteUser = async (id) => {

  try {

    const token =
      localStorage.getItem("token");

    await api.delete(
      `/users/${id}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    setUsers(
      users.map(user =>
        user._id === id
          ? {
              ...user,
              active: false
            }
          : user
      )
    );

  } catch (error) {

    console.error(
      "Delete failed:",
      error
    );

  }

};

const restoreUser = async (id) => {

  try {

    const token =
      localStorage.getItem("token");

    await api.put(
      `/users/restore/${id}`,
      {},
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    setUsers(
      users.map(user =>
        user._id === id
          ? {
              ...user,
              active: true
            }
          : user
      )
    );

  } catch (error) {

    console.error(
      "Restore failed:",
      error
    );

  }

};
const createUser = async () => {

  try {

    const token =
      localStorage.getItem("token");

    await api.post(
      "/users/register",
      newUser,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    alert(
      "Employee created successfully"
    );

    setShowModal(false);

    window.location.reload();

  } catch (error) {

    console.error(
      "Create user failed:",
      error
    );

    alert(
      error.response?.data?.message ||
      "Failed to create employee"
    );

  }

};
const updateUser = async () => {

  try {

    const token =
      localStorage.getItem("token");

    await api.put(

      `/users/${editingUser._id}`,

      editingUser,

      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }

    );

    alert(
      "User updated successfully"
    );

    setShowEditModal(false);

    window.location.reload();

  } catch (error) {

    console.error(
      "Update failed:",
      error
    );

    alert(
      error.response?.data?.message
      || "Update failed"
    );

  }

};

  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const token =
          localStorage.getItem("token");

        const response = await api.get(
          "/users",
          {
            params: {
              name: search,
              role: role,

              ...(status === "all"
                ? { all: true }
                : {
                    active:
                      status === "active"
                  })
            },

            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        setUsers(response.data);

      } catch (error) {

        console.error(
          "Error fetching users:",
          error
        );

      }

    };

    fetchUsers();

  }, [search, role, status]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        <div className="dashboard-body">
      <div className="users-header">

  <div>

    <h1>Users Management</h1>

    <p>
      Manage employee accounts,
      roles and permissions
    </p>

  </div>

  {currentUser?.role === "Admin" && (

    <button
      className="add-user-btn"
      onClick={() =>
        setShowModal(true)
      }
    >
      + Add Employee
    </button>

  )}

</div>

          <div className="users-overview">

            <div className="overview-card">

              <h2>
                {users.length}
              </h2>

              <span>
                Total Users
              </span>

            </div>

            <div className="overview-card">

              <h2>
                {
                  users.filter(
                    user => user.active
                  ).length
                }
              </h2>

              <span>
                Active Users
              </span>

            </div>

            <div className="overview-card">

              <h2>
                {
                  users.filter(
                    user => !user.active
                  ).length
                }
              </h2>

              <span>
                Inactive Users
              </span>

            </div>

          </div>

          <div className="filters-card">

            <input
              type="text"
              placeholder="🔍 Search users..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <div className="filter-row">

              <select
                value={role}
                onChange={(e) =>
                  setRole(
                    e.target.value
                  )
                }
              >

                <option value="">
                  All Roles
                </option>

                <option value="Admin">
                  Admin
                </option>

                <option value="HR">
                  HR
                </option>

                <option value="Developer">
                  Developer
                </option>

              </select>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
              >

                <option value="all">
                  All Users
                </option>

                <option value="active">
                  Active Users
                </option>

                <option value="inactive">
                  Inactive Users
                </option>

              </select>

            </div>

          </div>

          <div className="table-card">

            <table>

              <thead>

                <tr>
  <th>Name</th>
  <th>Email</th>
  <th>Role</th>
  <th>Status</th>

  {currentUser?.role === "Admin" && (
    <th>Actions</th>
  )}
</tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr key={user._id}>

                    <td>
                      {user.name}
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      {user.role}
                    </td>

                   <td>

  <span
    className={
      user.active
        ? "status active"
        : "status inactive"
    }
  >
    {
      user.active
        ? "Active"
        : "Inactive"
    }
  </span>

</td>

<td>

  {currentUser?.role === "Admin" ? (

    <div className="action-buttons">

      <button
  className="edit-btn"
  onClick={() => {

    setEditingUser(user);

    setShowEditModal(true);

  }}
>
  Edit
</button>

      {user.active ? (

        <button
          className="delete-btn"
          onClick={() =>
            deleteUser(user._id)
          }
        >
          Delete
        </button>

      ) : (

        <button
          className="restore-btn"
          onClick={() =>
            restoreUser(user._id)
          }
        >
          Restore
        </button>

      )}

    </div>

  ) : (

    <span
      style={{
        color: "#94a3b8",
        fontSize: "0.9rem"
      }}
    >
      View Only
    </span>

  )}

</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showModal && (

  <div className="modal-overlay">
    <div className="user-modal">
      <h2>
        Employee Onboarding
      </h2>
      <input
        type="text"
        placeholder="Name"
        value={newUser.name}
        onChange={(e) =>
          setNewUser({
            ...newUser,
            name:
              e.target.value
          })
        }
      />
      <input
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={(e) =>
          setNewUser({
            ...newUser,
            email:
              e.target.value
          })
        }
      />
      <div className="password-field">

  <input
    type={
      showPassword
        ? "text"
        : "password"
    }
    placeholder="Password"
    value={newUser.password}
    onChange={(e) =>
      setNewUser({
        ...newUser,
        password: e.target.value
      })
    }
  />

  <button
    type="button"
    className="toggle-password"
    onClick={() =>
      setShowPassword(
        !showPassword
      )
    }
  >
    {showPassword
      ? "Hide"
      : "Show"}
  </button>

</div>
      <select
        value={newUser.role}
        onChange={(e) =>
          setNewUser({
            ...newUser,
            role:
              e.target.value
          })
        }
      >
        <option>
          Admin
        </option>

        <option>
          HR
        </option>

        <option>
          Developer
        </option>
      </select>

      <input
        type="text"
        placeholder="Department"
        value={
          newUser.department
        }
        onChange={(e) =>
          setNewUser({
            ...newUser,
            department:
              e.target.value
          })
        }
      />

      <div className="modal-actions">

        <button
          className="cancel-btn"
          onClick={() =>
            setShowModal(false)
          }
        >
          Cancel
        </button>

        <button
          className="save-btn"
          onClick={createUser}
        >
          Create Employee
        </button>

      </div>

    </div>

  </div>

          
)}{showEditModal && editingUser && (

  <div className="modal-overlay">

    <div className="user-modal">

      <h2>
        Edit User
      </h2>

      <input
        type="text"
        value={editingUser.name}
        onChange={(e) =>
          setEditingUser({
            ...editingUser,
            name: e.target.value
          })
        }
      />

      <input
        type="email"
        value={editingUser.email}
        onChange={(e) =>
          setEditingUser({
            ...editingUser,
            email: e.target.value
          })
        }
      />

      <select
        value={editingUser.role}
        onChange={(e) =>
          setEditingUser({
            ...editingUser,
            role: e.target.value
          })
        }
      >

        <option>
          Admin
        </option>

        <option>
          HR
        </option>

        <option>
          Developer
        </option>

      </select>

      <input
        type="text"
        value={
          editingUser.department || ""
        }
        onChange={(e) =>
          setEditingUser({
            ...editingUser,
            department:
              e.target.value
          })
        }
      />

      <div className="modal-actions">

        <button
          className="cancel-btn"
          onClick={() =>
            setShowEditModal(false)
          }
        >
          Cancel
        </button>

        <button
          className="save-btn"
          onClick={updateUser}
        >
          Save Changes
        </button>

      </div>

    </div>

  </div>

)}

        </div>
      </div>
    </div>
  );
}
export default Users;