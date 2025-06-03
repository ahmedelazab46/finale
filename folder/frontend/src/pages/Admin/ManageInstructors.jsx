import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft } from 'react-icons/fa';
import '../../styles/ManageInstructors.css';

export default function ManageInstructors() {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    bio: '',
    expertise: '',
  });

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Making request with token:', token);
      const response = await axios.get('http://127.0.0.1:8000/users/admin/instructors/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response.data);
      setInstructors(response.data.instructors);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 403) {
          setError('You do not have permission to access this page. Please ensure you are logged in as an admin.');
          navigate('/admin/dashboard');
        } else if (error.response.status === 401) {
          setError('Your session has expired. Please log in again.');
          navigate('/login');
        } else {
          setError(error.response.data.error || 'Failed to fetch instructors');
        }
      } else {
        setError('Failed to fetch instructors. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (instructor) => {
    setEditingInstructor(instructor);
    setFormData({
      email: instructor.email,
      first_name: instructor.first_name,
      last_name: instructor.last_name,
      phone_number: instructor.phone_number,
      bio: instructor.bio,
      expertise: instructor.expertise,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this instructor?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      await axios.delete(`http://127.0.0.1:8000/users/admin/instructors/${id}/delete/`, { headers });
      fetchInstructors();
    } catch (error) {
      console.error('Error deleting instructor:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error || 'Failed to delete instructor');
      } else {
        setError('Failed to delete instructor. Please check your connection.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      if (editingInstructor) {
        // Update existing instructor
        await axios.put(`http://127.0.0.1:8000/users/admin/instructors/${editingInstructor.id}/update/`, formData, { headers });
      } else {
        // Add new instructor
        await axios.post('http://127.0.0.1:8000/users/admin/add-instructor/', formData, { headers });
      }
      fetchInstructors();
      resetForm();
    } catch (error) {
      console.error('Error saving instructor:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error || 'Failed to save instructor');
      } else {
        setError('Failed to save instructor. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      bio: '',
      expertise: '',
    });
    setEditingInstructor(null);
  };

  if (loading) {
    return (
      <div className="manage-instructors">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-instructors">
      <div className="container">
        <div className="page-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Manage Instructors</h2>
              <p className="mb-0 opacity-75">Add, edit or remove instructors</p>
            </div>
            <button
              className="back-button"
              onClick={() => navigate('/admin/dashboard')}
            >
              <FaArrowLeft />
              Back to Dashboard
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">{editingInstructor ? 'Edit Instructor' : 'Add New Instructor'}</h4>
            {editingInstructor && (
              <button className="btn btn-secondary" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
          <div className="card-body">
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

              {!editingInstructor && (
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!editingInstructor}
                  />
                </div>
              )}

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
                <button type="submit" className="btn btn-primary">
                  {editingInstructor ? (
                    <>
                      <FaEdit className="me-2" />
                      Update Instructor
                    </>
                  ) : (
                    <>
                      <FaPlus className="me-2" />
                      Add Instructor
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="mb-0">Instructors List</h4>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Expertise</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map((instructor) => (
                    <tr key={instructor.id}>
                      <td>{`${instructor.first_name} ${instructor.last_name}`}</td>
                      <td>{instructor.email}</td>
                      <td>{instructor.phone_number}</td>
                      <td>{instructor.expertise}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(instructor)}
                            title="Edit Instructor"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(instructor.id)}
                            title="Delete Instructor"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 