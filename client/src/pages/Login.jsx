import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 👇 NEW (logic only)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Store JWT + role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Role-based redirect
      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "teacher") navigate("/teacher");
      else navigate("/student");

    } catch (error) {
      alert("Server not responding");
    }
  };

  return (
    <>
      {/* ================= LOGIN PAGE ================= */}
      <section className="login-section">
        <div className="container py-5">
          <div className="row justify-content-center align-items-center min-vh-75">

            <div className="col-lg-5 col-md-7 col-sm-10">
              <div className="login-card">

                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="login-title">Welcome Back</h2>
                  <p className="login-subtitle">
                    Login to SBV School Management System
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Mail size={18} />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Lock size={18} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="btn toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember + Forgot */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="remember"
                      />
                      <label className="form-check-label" htmlFor="remember">
                        Remember me
                      </label>
                    </div>

                    <a href="#" className="forgot-link">
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit */}
                  <button type="submit" className="btn login-btn w-100">
                    <LogIn size={18} />
                    Login
                  </button>
                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= INTERNAL CSS ================= */}
      <style>{`
        * {
          font-family: 'Inter', sans-serif;
        }

        .login-section {
          background: linear-gradient(180deg, #d7d8b6 0%, #f2f2e4 100%);
        }

        .login-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 20px 45px rgba(0,0,0,0.15);
          animation: fadeUp 0.7s ease;
        }

        .login-title {
          font-weight: 700;
          color: #535434;
          margin-bottom: 0.4rem;
        }

        .login-subtitle {
          font-size: 0.95rem;
          color: #666;
        }

        .form-label {
          font-weight: 500;
          color: #535434;
        }

        .input-group-text {
          background-color: #f4f4ea;
          border: 1px solid #ccc;
        }

        .form-control {
          border-radius: 0;
          border: 1px solid #ccc;
        }

        .form-control:focus {
          border-color: #535434;
          box-shadow: 0 0 0 0.15rem rgba(83,84,52,0.25);
        }

        .toggle-btn {
          border: 1px solid #ccc;
          background: #f4f4ea;
        }

        .toggle-btn:hover {
          background: #e6e6d1;
        }

        .forgot-link {
          font-size: 0.9rem;
          color: #535434;
          text-decoration: none;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .login-btn {
          background-color: #535434;
          color: #ffffff;
          font-weight: 600;
          padding: 0.65rem;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .login-btn:hover {
          background-color: #6a6b48;
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(0,0,0,0.15);
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 576px) {
          .login-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default Login;
