import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaGraduationCap, FaStar, FaBook, FaDollarSign, FaUser } from 'react-icons/fa';
import '../../styles/InstructorProfile.css';

const InstructorProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    averageRating: 0,
    totalRevenue: 0
  });

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    bio: '',
    expertise: '',
    profile_pic: null
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          throw new Error('Authorization token not found');
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const response = await axios.get('http://127.0.0.1:8000/users/instructor/profile/', { headers });

        console.log('Profile response:', response.data);

        setFormData({
          first_name: response.data.user.first_name || '',
          last_name: response.data.user.last_name || '',
          email: response.data.user.email || '',
          phone_number: response.data.phone_number || '',
          bio: response.data.bio || '',
          expertise: response.data.expertise || '',
          profile_pic: response.data.profile_pic || null
        });

        setStats({
          totalCourses: response.data.total_courses || 0,
          totalStudents: response.data.total_students || 0,
          averageRating: response.data.average_rating || 0,
          totalRevenue: response.data.total_revenue || 0
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.response?.data?.error || 'Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.is_instructor) {
      fetchProfile();
    } else {
      setError('You are not authorized to view this page. Instructor access required.');
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profile_pic: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('Authorization token not found');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('user.first_name', formData.first_name);
      formDataToSend.append('user.last_name', formData.last_name);
      formDataToSend.append('user.email', formData.email);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('expertise', formData.expertise);
      if (formData.profile_pic instanceof File) {
        formDataToSend.append('profile_pic', formData.profile_pic);
      }

      await axios.put(
        'http://127.0.0.1:8000/users/instructor/profile/',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="instructor-profile">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="instructor-profile">
        <div className="container">
          <div className="error-message text-center py-5">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="instructor-profile">
      <div className="container">
        <div className="profile-header">
          <h2>Instructor Profile</h2>
          <p className="text-light opacity-75">Manage your personal info and view your statistics</p>
        </div>

        {success && <div className="success-message text-center mb-4">{success}</div>}

        <div className="row">
          <div className="col-md-4">
            <div className="profile-card">
              <div className="profile-info text-center">
                {formData.profile_pic ? (
                  <img
                    src={typeof formData.profile_pic === 'string' ? formData.profile_pic : URL.createObjectURL(formData.profile_pic)}
                    alt="Profile"
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    <FaUser size={50} />
                  </div>
                )}
                <h3 className="profile-name">{`${formData.first_name} ${formData.last_name}`}</h3>
                <p className="profile-title">Instructor</p>
                
                <div className="profile-stats">
                  <div className="stat-card">
                    <div className="stat-value">
                      <FaBook className="me-2" />
                      {stats.totalCourses}
                    </div>
                    <div className="stat-label">Courses</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      <FaGraduationCap className="me-2" />
                      {stats.totalStudents}
                    </div>
                    <div className="stat-label">Students</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      <FaStar className="me-2" />
                      {stats.averageRating.toFixed(1)}
                    </div>
                    <div className="stat-label">Average Rating</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      <FaDollarSign className="me-2" />
                      {stats.totalRevenue.toFixed(2)}
                    </div>
                    <div className="stat-label">Revenue</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="profile-card">
              <div className="profile-info">
                <h4 className="section-title">Personal Information</h4>
                
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Profile Picture</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Expertise</label>
                    <input
                      type="text"
                      className="form-control"
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleChange}
                      placeholder="e.g., Web Development, Data Science"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell us about yourself and your teaching experience"
                    ></textarea>
                  </div>

                  {error && <div className="error-message">{error}</div>}
                  {success && <div className="success-message">{success}</div>}

                  <button
                    type="submit"
                    className="save-button mt-4"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;
