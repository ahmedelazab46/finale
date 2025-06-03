import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserPlus, FaArrowLeft } from 'react-icons/fa';

export default function AddInstructor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    bio: '',
    expertise: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Log the exact form data being sent
      console.log('Form data being sent:', JSON.stringify(formData, null, 2));

      const response = await axios.post(
        'http://127.0.0.1:8000/users/admin/add-instructor/',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Server response:', response.data);
      setSuccess(true);
      setFormData({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        bio: '',
        expertise: '',
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Failed to add instructor:', error);
      // Log the full error response
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Failed to add instructor';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <FaUserPlus className="me-2" />
                Add New Instructor
              </h4>
              <button 
                className="btn btn-light btn-sm"
                onClick={() => navigate('/admin/dashboard')}
              >
                <FaArrowLeft className="me-1" />
                Back to Dashboard
              </button>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success" role="alert">
                  Instructor added successfully! Redirecting to dashboard...
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="first_name" className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="last_name" className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phone_number" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="expertise" className="form-label">Expertise</label>
                  <input
                    type="text"
                    className="form-control"
                    id="expertise"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Web Development, Data Science"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="bio" className="form-label">Bio</label>
                  <textarea
                    className="form-control"
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    required
                    placeholder="Tell us about the instructor's experience and qualifications"
                  ></textarea>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding Instructor...
                      </>
                    ) : (
                      <>
                        <FaUserPlus className="me-2" />
                        Add Instructor
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 