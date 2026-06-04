import "./../styles/Navbar.css";

function Navbar() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (

    <div className="navbar">

      <div>
        <h3>Dashboard</h3>
      </div>

      <div className="navbar-user">

        <div className="role-badge">
          {user?.role}
        </div>

        <div className="user-info">

          <span>{user?.name}</span>

          <small>{user?.email}</small>

        </div>

      </div>

    </div>

  );
}

export default Navbar;