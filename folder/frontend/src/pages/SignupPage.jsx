import React, { useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from 'react-icons/fc';
import { HiMail } from 'react-icons/hi';
import { BsChatDots, BsGlobe } from 'react-icons/bs';
import { FiPhone } from 'react-icons/fi';
import '../styles/Login.css';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";


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
        type: "error",
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
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const GoogleLoginButton = () => {
    return (
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log("Google credential:", credentialResponse.credential);
          axios.post("http://localhost:8000/users/google-login/", {
            access_token: credentialResponse.credential
          })
          .then((res) => {
            console.log("Backend response:", res.data);
            const { access_token, refresh_token, user } = res.data;
            
            // Store tokens and user data
            localStorage.setItem("access", access_token);
            localStorage.setItem("refresh", refresh_token);
            localStorage.setItem("user", JSON.stringify(user));
            
            // Navigate based on user role
            if (user.is_student) {
              navigate("/student/dashboard");
            } else if (user.is_instructor) {
              navigate("/instructor/dashboard");
            } else {
              navigate("/dashboard");
            }
          })
          .catch((err) => {
            console.error("Backend error:", err.response?.data);
            const errorMessage = err.response?.data?.error || 
                              "Google authentication failed. Please try again.";
            setMessage({
              text: errorMessage,
              type: "error"
            });
          });
        }}
        onError={() => {
          console.log("Login Failed");
          setMessage({
            text: "Google login failed. Please try again.",
            type: "error"
          });
        }}
      />
    );
  };

  return (
    <GoogleOAuthProvider clientId="917470419321-l0l90k2hnic8ctmsu2qemgs567pqdsna.apps.googleusercontent.com">
    <div className="login-container">
      <div className="login-content">
        <div className="login-form-section">
          <div className="brand">
            <Link to="/" className="logo-link">
              <img 
                src="/lewagon-logo.png" 
                alt="Le Wagon" 
                className="logo"
                onError={(e) => {
                  console.error('Logo failed to load');
                  e.target.src = 'https://www.lewagon.com/assets/v4/logo-lewagon-9c19fb39a748cd3b1f49059ce0dc6c0dfc4cc2447d5a9a3e01bd2d5a214faf3c.svg';
                }} 
              />
            </Link>
          </div>

          <div className="login-form">
            <h1>Create Account</h1>
            <p className="subtitle">Join our coding community</p>

            {message.text && (
              <div className={`${message.type === 'error' ? 'error-message' : 'success-message'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm_password">Confirm Password</label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="agree_to_terms"
                    checked={formData.agree_to_terms}
                    onChange={handleChange}
                    required
                  />
                  <span className="checkbox-text">
                    I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link>
                  </span>
                </label>
              </div>

              <button type="submit" className="sign-in-button" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <GoogleLoginButton />

              <p className="signup-prompt">
                Already have an account?{' '}
                <Link to="/login" className="signup-link">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>

        <div className="illustration-section">
          <div className="floating-icons">
            <HiMail className="icon mail" />
            <BsChatDots className="icon chat" />
            <BsGlobe className="icon globe" />
            <FiPhone className="icon phone" />
          </div>
          <div className="illustration">
            <svg className="woman-illustration" viewBox="0 0 500 500">
              {/* Simple abstract person illustration */}
              <circle cx="250" cy="150" r="50" className="head" />
              <path d="M200 200 Q250 300 300 200" className="body" />
              <path d="M250 250 L200 350" className="left-arm" />
              <path d="M250 250 L300 300 L320 280" className="right-arm" />
              {/* OK gesture */}
              <circle cx="320" cy="280" r="15" className="ok-gesture" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    </GoogleOAuthProvider>
  );
}

export default SignupPage; 