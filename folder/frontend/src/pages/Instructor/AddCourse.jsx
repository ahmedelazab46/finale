import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaPlus, FaHome, FaSignOutAlt, FaBook, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import InstructorNavbar from '../../components/layout/InstructorNavbar';
import '../../styles/AddCourse.css';

const AddCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    courseType: 'video',
    what_you_will_learn: '',
    level: 'Beginner',
    category: 'Programming',
    courseImage: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'courseImage') {
      setFormData(prev => ({
        ...prev,
        courseImage: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('access');
      
      const submitData = new FormData();
      // إضافة جميع البيانات إلى FormData
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          if (key === 'courseImage') {
            // تأكد من أن الصورة موجودة قبل إضافتها
            if (formData[key] instanceof File) {
              submitData.append(key, formData[key]);
            }
          } else {
            submitData.append(key, formData[key]);
          }
        }
      });

      // تصحيح المسار
      const response = await axios.post('http://127.0.0.1:8000/courses/instructor/add-course/', submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        console.log('Course added successfully:', response.data);
        navigate('/instructor/dashboard');
      }
    } catch (error) {
      console.error('Error adding course:', error.response?.data || error.message);
      // يمكنك إضافة معالجة الأخطاء هنا (مثل إظهار رسالة للمستخدم)
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="add-course">
      <InstructorNavbar />
      <div className="container">
        <div className="dashboard-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Add New Course</h2>
              <p>Create and customize your course content</p>
            </div>
            <div className="d-flex gap-2">
              <button className="action-button secondary" onClick={() => navigate('/instructor/dashboard')}>
                <FaArrowLeft /> Back to Dashboard
              </button>
              <button className="action-button secondary" onClick={() => navigate('/instructor/courses')}>
                <FaChalkboardTeacher /> My Courses
              </button>
              <button className="action-button logout-button" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>

        <div className="data-card">
          <div className="card-header">
            <h5>
              <FaGraduationCap />
              Course Information
            </h5>
          </div>
          <div className="card-body">
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
                  rows="4"
                />
              </div>

              <div className="row">
                <div className="col-md-6">
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
                </div>
                <div className="col-md-6">
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
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
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
                </div>
                <div className="col-md-4">
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
                </div>
                <div className="col-md-4">
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
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Course Image</label>
                <input
                  type="file"
                  name="courseImage"
                  className="form-control"
                  onChange={handleChange}
                  accept="image/*"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">What You Will Learn</label>
                <textarea
                  name="what_you_will_learn"
                  className="form-control"
                  value={formData.what_you_will_learn}
                  onChange={handleChange}
                  required
                  placeholder="Enter what students will learn from this course"
                  rows="4"
                />
              </div>

              <div className="d-flex justify-content-end gap-3 mt-4">
                <button
                  type="button"
                  className="action-button secondary"
                  onClick={() => navigate('/instructor/dashboard')}
                >
                  <FaArrowLeft /> Cancel
                </button>
                <button
                  type="submit"
                  className="action-button"
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
    </div>
  );
};

export default AddCourse; 