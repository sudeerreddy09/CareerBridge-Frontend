import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">

        <NavLink to="/" className="brand">
          <div className="brand-mark">C</div>

          <div className="brand-text">
            <span>Career</span>Bridge
          </div>
        </NavLink>

        <div className="nav-links">

          <NavLink to="/" end>
            Home
          </NavLink>

          <a href="#features">Features</a>

          <a href="#journey">How It Works</a>

          <a href="#about">About</a>

        </div>

        <div className="nav-actions">

          <NavLink to="/portfolio" className="nav-login">
            Portfolio
          </NavLink>

          <NavLink to="/login" className="nav-login">
            Login
          </NavLink>

          <NavLink to="/register" className="nav-register">
            Get Started
          </NavLink>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;