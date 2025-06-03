import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import axios from 'axios';
import '../../styles/AddCourse.css';

const AddCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    courseType: 'video',
    what_you_will_learn: '',
    level: 'Beginner',
    category: 'Programming'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('access');
      await axios.post('http://127.0.0.1:8000/courses/api/instructor/courses/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      navigate('/instructor/dashboard');
    } catch (error) {
      console.error('Error adding course:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-course">
      <div className="container">
        <div className="page-header">
          <h2>Add New Course</h2>
          <p>Create a new course to share your knowledge</p>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Course Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter course title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Enter course description"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Enter course price"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration (hours)</label>
              <input
                type="number"
                name="duration"
                className="form-control"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                placeholder="Enter course duration in hours"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Course Type</label>
              <select
                name="courseType"
                className="form-control"
                value={formData.courseType}
                onChange={handleChange}
                required
              >
                <option value="video">Video Course</option>
                <option value="text">Text Course</option>
                <option value="mixed">Mixed Content</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">What You Will Learn</label>
              <textarea
                name="what_you_will_learn"
                className="form-control"
                value={formData.what_you_will_learn}
                onChange={handleChange}
                required
                placeholder="Enter what students will learn"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Level</label>
              <select
                name="level"
                className="form-control"
                value={formData.level}
                onChange={handleChange}
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
                <option value="Music">Music</option>
                <option value="Photography">Photography</option>
              </select>
            </div>

            <div className="btn-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/instructor/dashboard')}
              >
                <FaArrowLeft /> Back to Dashboard
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <FaSave /> Save Course
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse; 