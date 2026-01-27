import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/react.svg";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg school-navbar">
        <div className="container">
          {/* Brand */}
          <NavLink
            to="/"
            className="navbar-brand d-flex align-items-center gap-2 fw-bold"
          >
            <img src={logo} alt="School Logo" height="42" />
            <span className="brand-text">SBV School</span>
          </NavLink>

          {/* Toggle */}
          <button
            className="navbar-toggler custom-toggler"
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            <span className={`toggler-line ${open ? "open" : ""}`}></span>
            <span className={`toggler-line ${open ? "open" : ""}`}></span>
            <span className={`toggler-line ${open ? "open" : ""}`}></span>
          </button>

          {/* Menu */}
          <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-4">
              {["/", "/about", "/contact"].map((path, i) => (
                <li className="nav-item" key={i}>
                  <NavLink
                    to={path}
                    end={path === "/"}
                    className="nav-link"
                    onClick={() => setOpen(false)}
                  >
                    {path === "/" ? "Home" : path.slice(1)}
                  </NavLink>
                </li>
              ))}

              {/* CTA */}
              <li className="nav-item ms-lg-3">
                <NavLink
                  to="/login"
                  className="btn login-btn px-4 py-2"
                  onClick={() => setOpen(false)}
                >
                  Login
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ================= INTERNAL CSS ================= */}
      <style>{`
        * {
          font-family: 'Inter', sans-serif;
        }

        /* Base Navbar */
        .school-navbar {
          background: linear-gradient(
            135deg,
            #535434 0%,
            #6a6b48 100%
          );
          padding: 0.75rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .school-navbar:hover {
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        /* Brand */
        .brand-text {
          color: #d7d8b6;
          font-size: 1.3rem;
          letter-spacing: 0.6px;
        }

        /* Nav Links */
        .school-navbar .nav-link {
          color: #f5f5ef;
          font-weight: 500;
          position: relative;
          padding: 6px 0;
          transition: color 0.3s ease;
        }

        .school-navbar .nav-link:hover {
          color: #d7d8b6;
        }

        .school-navbar .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 0%;
          height: 2px;
          background-color: #d7d8b6;
          transition: width 0.3s ease;
        }

        .school-navbar .nav-link:hover::after,
        .school-navbar .nav-link.active::after {
          width: 100%;
        }

        /* Login Button */
        .login-btn {
          background-color: #d7d8b6;
          color: #535434;
          font-weight: 600;
          border-radius: 30px;
          transition: all 0.3s ease;
        }

        .login-btn:hover {
          background-color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        }

        /* Custom Toggler */
        .custom-toggler {
          border: none;
          background: transparent;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .custom-toggler:focus {
          box-shadow: none;
        }

        .toggler-line {
          width: 26px;
          height: 2px;
          background-color: #d7d8b6;
          transition: all 0.3s ease;
        }

        .toggler-line.open:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .toggler-line.open:nth-child(2) {
          opacity: 0;
        }

        .toggler-line.open:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* Mobile Menu */
        @media (max-width: 991px) {
          .navbar-collapse {
            background-color: #535434;
            margin-top: 1rem;
            padding: 1rem 1.5rem;
            border-radius: 14px;
            animation: slideDown 0.35s ease;
          }

          .school-navbar .nav-link {
            padding: 10px 0;
            font-size: 1.05rem;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
