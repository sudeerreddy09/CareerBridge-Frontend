import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
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
            : "Registration failed."
        );
        return;
      }

      setMessage(
        "Registration successful! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(error);

      setMessage(
        "Cannot connect to the backend. Make sure Spring Boot is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordLength = formData.password.length;

  let passwordStrength = "";

  if (passwordLength >= 10) {
    passwordStrength = "Strong password";
  } else if (passwordLength >= 6) {
    passwordStrength = "Good password";
  } else if (passwordLength > 0) {
    passwordStrength = "Password is too short";
  }

  return (
    <div className="auth-page">

      <div className="auth-visual register-visual">

        <Link to="/" className="auth-logo">
          <div className="brand-mark">C</div>

          <div className="brand-text">
            <span>Career</span>Bridge
          </div>
        </Link>

        <div className="auth-visual-content">

          <div className="auth-pill">
            <span></span>
            START YOUR JOURNEY
          </div>

          <h1>
            Build skills.
            <br />
            Find your
            <br />
            <span>direction.</span>
          </h1>

          <p>
            Create your CareerBridge account and
            take the first step toward a clearer,
            more connected career.
          </p>

          <div className="career-steps">

            <div className="career-step active">
              <div>01</div>
              <span>Discover your path</span>
            </div>

            <div className="career-step">
              <div>02</div>
              <span>Build your skills</span>
            </div>

            <div className="career-step">
              <div>03</div>
              <span>Find opportunities</span>
            </div>

          </div>

        </div>

        <div className="auth-visual-footer">
          <span>CareerBridge</span>
          <span>Your future, connected.</span>
        </div>

      </div>

      <div className="auth-form-section">

        <div className="auth-form-container register-container">

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
              GET STARTED
            </div>

            <h2>Create your account</h2>

            <p>
              Start building your career with CareerBridge.
            </p>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label>Full name</label>

              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

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

              <label>Password</label>

              <div className="password-input">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
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
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

              {passwordStrength && (
                <div className="password-strength">

                  <div className="strength-bars">

                    <span
                      className={
                        passwordLength >= 1
                          ? "filled"
                          : ""
                      }
                    />

                    <span
                      className={
                        passwordLength >= 6
                          ? "filled"
                          : ""
                      }
                    />

                    <span
                      className={
                        passwordLength >= 10
                          ? "filled"
                          : ""
                      }
                    />

                  </div>

                  <small>
                    {passwordStrength}
                  </small>

                </div>
              )}

            </div>

            <div className="form-group">

              <label>Confirm password</label>

              <div className="password-input">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            <label className="terms-row">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the
                <a href="#terms">
                  Terms of Service
                </a>
                and
                <a href="#privacy">
                  Privacy Policy
                </a>
              </span>

            </label>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}

              <span>→</span>
            </button>

            {message && (
              <div className="auth-message">
                {message}
              </div>
            )}

          </form>

          <p className="auth-switch">
            Already have an account?
            <Link to="/login">
              Sign in
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;