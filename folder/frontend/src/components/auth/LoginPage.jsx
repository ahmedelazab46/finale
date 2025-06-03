import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Configure axios to attach token to all requests
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/api/token/', { 
        email, 
        password 
      });
  
      console.log("API Response:", response.data);
  
      const { access, refresh, email: userEmail, is_student, is_instructor } = response.data;
      
      // افترض أن is_superuser = true إذا لم يكن طالبًا ولا مدرسًا
      const is_superuser = !is_student && !is_instructor;
  
      const userData = {
        email: userEmail,
        is_student,
        is_instructor,
        is_superuser
      };

      // احفظ البيانات في localStorage
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('user', JSON.stringify(userData));

      // تحديث حالة المستخدم في AuthContext
      login(userData);
  
      await Swal.fire({
        icon: 'success',
        title: 'Login successful!',
        timer: 1500,
      });
  
      // التوجيه بناءً على الدور
      if (is_superuser) {
        console.log('Navigating to admin dashboard');
        navigate('/admin/dashboard');
      } else if (is_instructor) {
        console.log('Navigating to instructor dashboard');
        navigate('/instructor/dashboard');
      } else {
        console.log('Navigating to student dashboard');
        navigate('/student/dashboard');
      }
  
    } catch (error) {
      console.error("Login Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Login failed!',
        text: error.response?.data?.detail || 'Invalid credentials',
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
    <div className="bg-dark text-white d-flex align-items-center justify-content-center vh-100">
      <div 
        className="card p-4 rounded-4 shadow-lg" 
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          background: 'linear-gradient(135deg, #1e1e2f, #2e2e4d)' 
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-danger">&lt;/&gt; Le Wagon</h2>
          <h5>Welcome Back</h5>
          <p className="text-muted small">Continue your coding journey</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control rounded-3"
              value={email}
              placeholder="admin@test.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control rounded-3"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                disabled={loading}
              />
              <label className="form-check-label small">Remember me</label>
            </div>
            <a href="#" className="small text-decoration-none text-light">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className="btn w-100 text-white fw-bold mb-3" 
            style={{ background: 'linear-gradient(to right, #667eea, #764ba2)' }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In →'}
          </button>

          <div className="text-center text-muted my-2">Or continue with</div>

          <div className="d-flex justify-content-between mb-3">
            <GoogleLoginButton />
          </div>

          <div className="text-center mt-3">
            <span className="text-light">New to Le Wagon?</span>{' '}
            <a href="/signup" className="text-primary">Create account</a>
          </div>
        </form>
      </div>
    </div>
  </GoogleOAuthProvider>
  );
}

export default Login;