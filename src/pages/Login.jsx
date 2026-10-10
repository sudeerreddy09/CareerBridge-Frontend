import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://careerbridge-backend-rw9x.onrender.com/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const responseText = await response.text();

      let result;

      try {
        result = JSON.parse(responseText);
      } catch {
        result = responseText;
      }

      if (!response.ok) {
        setMessage(
          typeof result === "string"
            ? result
            : "Invalid email or password."
        );
        return;
      }

      // Store the logged-in user temporarily
      localStorage.setItem(
        "careerbridgeUser",
        JSON.stringify(result)
      );

      setMessage("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      console.error(error);

      setMessage(
        "Cannot connect to the backend. Make sure Spring Boot is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-visual">

        <Link to="/" className="auth-logo">
          <div className="brand-mark">C</div>

          <div className="brand-text">
            <span>Career</span>Bridge
          </div>
        </Link>

        <div className="auth-visual-content">

          <div className="auth-pill">
            <span></span>
            YOUR CAREER JOURNEY
          </div>

          <h1>
            Your next
            <br />
            <span>opportunity</span>
            <br />
            starts here.
          </h1>

          <p>
            Connect your skills, discover opportunities,
            and build the career you want with CareerBridge.
          </p>

          <div className="auth-mini-dashboard">

            <div className="auth-mini-top">
              <span>Career Progress</span>
              <strong>72%</strong>
            </div>

            <div className="auth-progress">
              <div></div>
            </div>

            <div className="auth-mini-bottom">
              <span>Skills developed</span>
              <strong>8 / 12</strong>
            </div>

          </div>

        </div>

        <div className="auth-visual-footer">
          <span>CareerBridge</span>
          <span>Build. Learn. Grow.</span>
        </div>

      </div>

      <div className="auth-form-section">

        <div className="auth-form-container">

          <div className="mobile-auth-logo">
            <Link to="/" className="auth-logo">
              <div className="brand-mark">C</div>

              <div className="brand-text">
                <span>Career</span>Bridge
              </div>
            </Link>
          </div>

          <div className="auth-heading">

            <div className="auth-welcome">
              WELCOME BACK
            </div>

            <h2>Sign in to your account</h2>

            <p>
              Continue your career journey with CareerBridge.
            </p>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label>Email address</label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <div className="form-label-row">

                <label>Password</label>

                <button
                  type="button"
                  className="forgot-button"
                  onClick={() =>
                    setMessage(
                      "Password recovery will be added soon."
                    )
                  }
                >
                  Forgot password?
                </button>

              </div>

              <div className="password-input">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            <label className="remember-row">

              <input type="checkbox" />

              <span>Remember me</span>

            </label>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}

              <span>→</span>
            </button>

            {message && (
              <div className="auth-message">
                {message}
              </div>
            )}

          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-switch">
            Don't have an account?

            <Link to="/register">
              Create one
            </Link>
          </p>

          <p className="auth-terms">
            By continuing, you agree to CareerBridge's
            Terms of Service and Privacy Policy.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;