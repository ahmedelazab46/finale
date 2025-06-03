import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/ManageStudents.css';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get('http://127.0.0.1:8000/users/admin/students/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStudents(response.data.students);
    } catch (error) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      email: student.email,
      first_name: student.first_name,
      last_name: student.last_name,
      phone: student.phone,
      password: ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      const token = localStorage.getItem('access');
      await axios.delete(`http://127.0.0.1:8000/users/admin/students/${id}/delete/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchStudents();
    } catch (error) {
      setError('Failed to delete student');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log('Submitting student formData:', formData);
    try {
      const token = localStorage.getItem('access');
      if (editingStudent) {
        await axios.put(`http://127.0.0.1:8000/users/admin/students/${editingStudent.id}/update/`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        await axios.post('http://127.0.0.1:8000/users/admin/students/add/', formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      fetchStudents();
      resetForm();
    } catch (error) {
      console.error('Error saving student:', error);
      if (error.response) {
        console.log('Error response:', JSON.stringify(error.response.data, null, 2));
        setError(error.response.data.error || 'Failed to save student');
      } else {
        setError('Failed to save student');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', first_name: '', last_name: '', phone: '' });
    setEditingStudent(null);
  };

  if (loading) {
    return (
      <div className="manage-students">
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
    <div className="manage-students">
      <div className="container">
        <div className="page-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Manage Students</h2>
              <p className="mb-0 opacity-75">Add, edit or remove students</p>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/admin/dashboard')}
            >
              <FaArrowLeft className="me-2" />
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
            <h4 className="mb-0">{editingStudent ? 'Edit Student' : 'Add New Student'}</h4>
            {editingStudent && (
              <button className="btn btn-secondary" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
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
                <div className="col-md-6 mb-3">
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

              <div className="mb-3">
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

              {!editingStudent && (
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                {editingStudent ? (
                  <>
                    <FaEdit className="me-2" />
                    Update Student
                  </>
                ) : (
                  <>
                    <FaPlus className="me-2" />
                    Add Student
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="mb-0">Students List</h4>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{`${student.first_name} ${student.last_name}`}</td>
                      <td>{student.email}</td>
                      <td>{student.phone}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(student)}
                            title="Edit Student"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(student.id)}
                            title="Delete Student"
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