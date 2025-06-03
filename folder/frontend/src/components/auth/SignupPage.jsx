import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function SignupPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    agree_to_terms: false,
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    if (formData.password !== formData.confirm_password) {
      setMessage({
        text: "Passwords do not match",
        type: "danger",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/users/register/",
        formData
      );
      setMessage({
        text: "Account created successfully! Redirecting to login...",
        type: "success",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.detail || "Registration failed",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

 
  const GoogleLoginButton = () => {
    const login = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
        try {
          const { access_token } = tokenResponse;

          const res = await axios.post(
            "http://localhost:8000/api/google-login/",
            { access_token },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const { access, refresh, user } = res.data;

          localStorage.setItem("access", access);
          localStorage.setItem("refresh", refresh);
          localStorage.setItem("user", JSON.stringify(user));

          navigate("/student/dashboard");
        } catch (error) {
          console.error("Google login error", error.response?.data || error);
        }
      },
      onError: (error) => {
        console.error("Google login failed", error);
      },
    });

    return (
      <button className="btn btn-outline-light w-100" onClick={() => login()}>
        <i className="bi bi-google me-2"></i> Sign in with Google
      </button>
    );
  };

  return (
    <GoogleOAuthProvider clientId="917470419321-l0l90k2hnic8ctmsu2qemgs567pqdsna.apps.googleusercontent.com">
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div
                className="card border-0 shadow-lg"
                style={{
                  background: "linear-gradient(145deg, #1f1f2e, #2a2a40)",
                  borderRadius: "1rem",
                }}
              >
                <div className="card-body p-4 p-md-5">
                  <div className="text-center mb-4">
                    <i className="bi bi-code-slash text-danger display-4"></i>
                    <h4 className="text-danger fw-bold mt-3">Le Wagon</h4>
                    <h5 className="text-white fw-semibold mt-2">
                      Create Account
                    </h5>
                    <p className="text-muted">Join our community</p>
                  </div>

                  {message.text && (
                    <div
                      className={`alert alert-${message.type}`}
                      role="alert"
                    >
                      <i
                        className={`bi bi-${
                          message.type === "success"
                            ? "check-circle"
                            : "exclamation-triangle"
                        }-fill me-2`}
                      ></i>
                      {message.text}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control bg-dark text-white border-secondary"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="First Name"
                            required
                          />
                          <label
                            htmlFor="first_name"
                            className="text-secondary"
                          >
                            First Name
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control bg-dark text-white border-secondary"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Last Name"
                            required
                          />
                          <label
                            htmlFor="last_name"
                            className="text-secondary"
                          >
                            Last Name
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        type="email"
                        className="form-control bg-dark text-white border-secondary"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        required
                      />
                      <label htmlFor="email" className="text-secondary">
                        Email Address
                      </label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control bg-dark text-white border-secondary"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                      />
                      <label htmlFor="password" className="text-secondary">
                        Password
                      </label>
                    </div>

                    <div className="form-floating mb-4">
                      <input
                        type="password"
                        className="form-control bg-dark text-white border-secondary"
                        id="confirm_password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                      />
                      <label
                        htmlFor="confirm_password"
                        className="text-secondary"
                      >
                        Confirm Password
                      </label>
                    </div>

                    <div className="form-check mb-4">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="agree_to_terms"
                        name="agree_to_terms"
                        checked={formData.agree_to_terms}
                        onChange={handleChange}
                        required
                      />
                      <label
                        className="form-check-label text-secondary"
                        htmlFor="agree_to_terms"
                      >
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-info text-decoration-none"
                        >
                          Terms of Service
                        </a>
                      </label>
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary py-3 fw-bold"
                        disabled={loading}
                        style={{
                          background:
                            "linear-gradient(to right, #6a11cb, #2575fc)",
                          border: "none",
                        }}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Create Account{" "}
                            <i className="bi bi-arrow-right ms-2"></i>
                          </>
                        )}
                      </button>
                      <div className="text-center text-muted my-2">
                        Or Register with
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <GoogleLoginButton />
                      </div>
                    </div>
                  </form>
                  <div className="text-center mt-4">
                    <p className="text-secondary mb-0">
                      Already have an account?{" "}
                      <a
                        href="/login"
                        className="text-info text-decoration-none"
                      >
                        Sign in
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default SignupPage;
