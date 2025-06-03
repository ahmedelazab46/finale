import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash, FaHome, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import '../../styles/InstructorCourses.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.get(
        `${API_BASE_URL}/courses/instructor/courses/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      Swal.fire(
        'Error!',
        'Failed to load courses',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('access');
        await axios.delete(
          `${API_BASE_URL}/courses/instructor/delete-course/${courseId}/`,
         
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );

        setCourses(courses.filter(course => course.id !== courseId));
        Swal.fire(
          'Deleted!',
          'Your course has been deleted.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      Swal.fire(
        'Error!',
        'Failed to delete course',
        'error'
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="instructor-courses">
        <div className="loading-spinner">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="instructor-courses">
      <div className="container">
        <div className="dashboard-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>My Courses</h2>
              <p className="text-light opacity-75">Manage your courses</p>
            </div>
            <div>
              <button className="action-button me-2" onClick={() => navigate('/instructor/add-course')}>
                <FaPlus className="me-2" />
                Add New Course
              </button>
              <button className="action-button secondary me-2" onClick={() => navigate('/instructor/dashboard')}>
                <FaArrowLeft className="me-2" />
                Back to Dashboard
              </button>
              <button className="action-button secondary me-2" onClick={() => navigate('/')}>
                <FaHome className="me-2" />
                Back to Home
              </button>
              <button className="action-button logout-button" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="data-card">
          <div className="card-header">
            <h5>All Courses</h5>
          </div>
          <div className="card-body">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Students</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.title}</td>
                    <td>{course.category}</td>
                    <td>{course.level}</td>
                    <td>{course.students_count || 0}</td>
                    <td>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: `${(course.average_rating || 0) * 20}%` }}
                          title={`${course.average_rating || 0}/5`}
                        />
                      </div>
                    </td>
                    <td>
                      <button
                        className="action-button secondary me-2"
                        onClick={() => navigate(`/instructor/edit-course/${course.id}`)}
                      >
                        <FaEdit />
                        Edit
                      </button>
                      
                      <button
                        className="action-button secondary"
                        onClick={() => handleDelete(course.id)}
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses; 