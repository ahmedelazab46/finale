import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/ManageCourses.css';

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    instructor_id: '',
    duration: '',
    courseType: '',
    what_you_will_learn: '',
    level: 'Beginner',
    category: 'Programming'
  });
  const [instructors, setInstructors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get('http://127.0.0.1:8000/users/admin/courses/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('API Response:', response.data);
      setCourses(response.data.courses);
    } catch (error) {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get('http://127.0.0.1:8000/users/admin/instructors/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setInstructors(response.data.instructors);
    } catch (error) {
      setError('Failed to fetch instructors');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      instructor_id: instructors.find(i => i.first_name + ' ' + i.last_name === course.instructor)?.id || '',
      duration: course.duration || '',
      courseType: course.courseType || '',
      what_you_will_learn: course.what_you_will_learn || '',
      level: course.level || 'Beginner',
      category: course.category || 'Programming'
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const token = localStorage.getItem('access');
      await axios.delete(`http://127.0.0.1:8000/users/admin/courses/${id}/delete/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCourses();
    } catch (error) {
      setError('Failed to delete course');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log('Submitting course formData:', formData);
    try {
      const token = localStorage.getItem('access');
      if (editingCourse) {
        await axios.put(`http://127.0.0.1:8000/users/admin/courses/${editingCourse.id}/update/`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        await axios.post('http://127.0.0.1:8000/users/admin/courses/add/', formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      fetchCourses();
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
      if (error.response) {
        console.log('Error response:', JSON.stringify(error.response.data, null, 2));
        setError(error.response.data.error || 'Failed to save course');
      } else {
        setError('Failed to save course');
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
    setFormData({ 
      title: '', 
      description: '', 
      price: '', 
      instructor_id: '', 
      duration: '', 
      courseType: '', 
      what_you_will_learn: '', 
      level: 'Beginner', 
      category: 'Programming' 
    });
    setEditingCourse(null);
  };

  if (loading) {
    return (
      <div className="manage-courses">
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
    <div className="manage-courses">
      <div className="container">
        <div className="page-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Manage Courses</h2>
              <p className="mb-0 opacity-75">Add, edit or remove courses</p>
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
            <h4 className="mb-0">{editingCourse ? 'Edit Course' : 'Add New Course'}</h4>
            {editingCourse && (
              <button className="btn btn-secondary" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Instructor</label>
                  <select
                    className="form-select"
                    name="instructor_id"
                    value={formData.instructor_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map(i => (
                      <option key={i.id} value={i.id}>{i.first_name} {i.last_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Duration (hours)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Course Type</label>
                  <select
                    className="form-select"
                    name="courseType"
                    value={formData.courseType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">What You Will Learn</label>
                <textarea
                  className="form-control"
                  name="what_you_will_learn"
                  value={formData.what_you_will_learn}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Level</label>
                  <select
                    className="form-select"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Business">Business</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                {editingCourse ? (
                  <>
                    <FaEdit className="me-2" />
                    Update Course
                  </>
                ) : (
                  <>
                    <FaPlus className="me-2" />
                    Add Course
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="mb-0">Courses List</h4>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Instructor</th>
                    <th>Level</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course.id}>
                      <td>{course.title}</td>
                      <td>{course.description}</td>
                      <td>${course.price}</td>
                      <td>{course.instructor}</td>
                      <td>{course.level}</td>
                      <td>{course.category}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(course)}
                            title="Edit Course"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(course.id)}
                            title="Delete Course"
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