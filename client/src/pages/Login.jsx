import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn
} from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "teacher") navigate("/teacher/dashboard");
      else navigate("/student/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
      {/* ================= LOGIN PAGE ================= */}
      <section className="login-section">
        <div className="container">
          <div className="row justify-content-center align-items-center min-vh-100">

            <div className="col-lg-5 col-md-7 col-sm-10">
              <div className="login-card">

                {/* Header */}
                <div className="text-center mb-4">
                  <div className="login-logo">SBV</div>
                  <h2 className="login-title">Welcome Back</h2>
                  <p className="login-subtitle">
                    Login to SBV School Management System
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="login-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin}>
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
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn login-btn w-100"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : (
                      <>
                        <LogIn size={18} />
                        Login
                      </>
                    )}
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
          border-radius: 22px;
          padding: 2.5rem;
          box-shadow: 0 25px 55px rgba(0,0,0,0.18);
          animation: fadeUp 0.6s ease;
        }

        .login-logo {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #535434, #6a6b48);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 800;
          font-size: 1.4rem;
          margin: 0 auto 1rem;
        }

        .login-title {
          font-weight: 700;
          color: #535434;
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

        .login-btn {
          background-color: #535434;
          color: #ffffff;
          font-weight: 600;
          padding: 0.7rem;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .login-btn:hover:not(:disabled) {
          background-color: #6a6b48;
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-error {
          display: flex;
          gap: 8px;
          align-items: center;
          background: #fdecec;
          color: #a94442;
          padding: 0.6rem 0.8rem;
          border-radius: 10px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
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
      <Footer/>
    </>
  );
};

export default Login;
