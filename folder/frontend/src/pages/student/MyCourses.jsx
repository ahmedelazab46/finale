import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlayCircle, FaBook, FaClock, FaLevelUpAlt, FaCertificate } from 'react-icons/fa';
import '../../styles/StudentMyCourses.css';

const API_BASE_URL = 'http://127.0.0.1:8000';
const StudentMyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          throw new Error('No access token found');
        }

        const response = await axios.get(`${API_BASE_URL}/courses/student/enrolled-courses/`,
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
        setError('Failed to load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
    const getImageUrl = (course) => {
    if (!course.courseImage) {
      return 'https://via.placeholder.com/300x200?text=No+Image';
    }
    if (course.courseImage.startsWith('http')) {
      return course.courseImage;
    }
    return `http://127.0.0.1:8000${course.courseImage}`;
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'success';
    if (progress >= 40) return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <div className="student-courses">
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
    <div className="student-courses">
      <div className="container">
        <div className="page-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>My Courses</h2>
              <p className="text-light opacity-75">Track your learning progress</p>
            </div>
            <Link to="/courses" className="browse-courses-button">
              <FaBook className="me-2" />
              Browse More Courses
            </Link>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaBook />
            </div>
            <h3>No Enrolled Courses</h3>
            <p>Start your learning journey by enrolling in a course!</p>
            <Link to="/courses" className="browse-courses-button">
              <FaBook className="me-2" />
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {courses.map((course) => (
              <div key={course.id} className="col-md-6 col-lg-4">
                <div className="course-card">
                  <div className="course-image">
                       <img
                          src={getImageUrl(course)}
                          alt={course.title}
                          className="card-img-top"
                          style={{ height: '200px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
                        />
                    <div className="course-progress">
                      <div 
                        className={`progress-bar ${getProgressColor(course.progress)}`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="course-content">
                    <h3>{course.title}</h3>
                    <div className="course-meta">
                      <div className="meta-item">
                        <FaClock className="meta-icon" />
                        <span>{course.duration} hours</span>
                      </div>
                      <div className="meta-item">
                        <FaLevelUpAlt className="meta-icon" />
                        <span>{course.level}</span>
                      </div>
                      {course.certificate_available && (
                        <div className="meta-item">
                          <FaCertificate className="meta-icon" />
                          <span>Certificate</span>
                        </div>
                      )}
                    </div>
                    <div className="progress-info">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="progress">
                        <div
                          className={`progress-bar bg-${getProgressColor(course.progress)}`}
                          role="progressbar"
                          style={{ width: `${course.progress}%` }}
                          aria-valuenow={course.progress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                    </div>
                    <div className="course-actions">
                      <Link 
                        to={`/courses/${course.slug}/learn`} 
                        className="continue-button"
                      >
                        <FaPlayCircle className="me-2" />
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMyCourses; 