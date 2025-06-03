import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  FaGraduationCap, 
  FaBook, 
  FaCheckCircle, 
  FaSpinner, 
  FaPlus, 
  FaChartLine,
  FaUsers,
  FaStar
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import '../../styles/StudentDashboard.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    averageProgress: 0,
    courses: [],
    recommendedCourses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access');
      if (!token) {
        Swal.fire({
          icon: 'warning',
          title: 'Login Required',
          text: 'Please log in to view your dashboard.',
          confirmButtonText: 'Go to Login',
        }).then(() => navigate('/login'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const [enrolledRes, recommendedRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/courses/student/enrolled-courses/`, { headers }),
          axios.get(`${API_BASE_URL}/courses/all/?limit=3`, { headers }),
        ]);

        console.log('Enrolled Courses:', enrolledRes.data);
        console.log('Recommended Courses:', recommendedRes.data);

        const enrolledCourses = Array.isArray(enrolledRes.data)
          ? enrolledRes.data
          : enrolledRes.data?.courses || [];
        const recommendedCourses = Array.isArray(recommendedRes.data)
          ? recommendedRes.data
          : recommendedRes.data?.courses || [];

        const completed = enrolledCourses.filter(course => course.progress === 100).length;
        const totalProgress = enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0);
        const averageProgress = enrolledCourses.length > 0 
          ? Math.round(totalProgress / enrolledCourses.length) 
          : 0;

        setStats({
          enrolledCourses: enrolledCourses.length,
          completedCourses: completed,
          inProgressCourses: enrolledCourses.length - completed,
          averageProgress,
          courses: enrolledCourses,
          recommendedCourses,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        console.error('Error details:', error.response?.data);
        console.error('Error status:', error.response?.status);

        let errorMessage = 'Failed to load data. Please try again later.';
        if (!navigator.onLine) {
          errorMessage = 'No internet connection. Please check your network.';
        } else if (error.response?.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
          localStorage.removeItem('access');
          Swal.fire({
            icon: 'warning',
            title: 'Session Expired',
            text: errorMessage,
            confirmButtonText: 'Go to Login',
          }).then(() => navigate('/login'));
        } else if (error.response?.status === 500) {
          errorMessage = error.response.data?.error || 'Server error. Please try again later.';
        }

        setError(errorMessage);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          toast: true,
          position: 'top-end',
          timer: 3000,
        });

        setStats({
          enrolledCourses: 0,
          completedCourses: 0,
          inProgressCourses: 0,
          averageProgress: 0,
          courses: [],
          recommendedCourses: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleGetCertificate = async (courseId) => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        Swal.fire({
          icon: 'warning',
          title: 'Session Expired',
          text: 'Please log in to continue.',
          confirmButtonText: 'Go to Login',
        }).then(() => navigate('/login'));
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/student/certificate/${courseId}/`, { headers });
      Swal.fire({
        icon: 'success',
        title: 'Certificate Generated',
        text: 'Your certificate has been downloaded.',
      });
      window.open(res.data.certificate_url, '_blank');
    } catch (error) {
      console.error('Error fetching certificate:', error);
      let errorMessage = 'Failed to generate certificate.';
      if (error.response?.status === 404) {
        errorMessage = 'Certificate endpoint not found. Please contact support.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.error || 'Course not completed.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
        localStorage.removeItem('access');
        navigate('/login');
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        toast: true,
        position: 'top-end',
        timer: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="student-dashboard">
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

  if (error) {
    return (
      <div className="student-dashboard">
        <div className="container">
          <div className="alert alert-danger text-center">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Student Dashboard</h2>
              <p className="text-light opacity-75 mb-0">Welcome back, {user?.email || 'Student'}</p>
            </div>
            <button className="action-button" onClick={() => navigate('/courses')}>
              <FaPlus className="me-2" />
              Browse Courses
            </button>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="stats-card">
              <div className="icon">
                <FaBook />
              </div>
              <h5>Enrolled Courses</h5>
              <div className="value">{stats.enrolledCourses}</div>
              <div className="subtitle">Total courses</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-card">
              <div className="icon">
                <FaCheckCircle />
              </div>
              <h5>Completed</h5>
              <div className="value">{stats.completedCourses}</div>
              <div className="subtitle">Finished courses</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-card">
              <div className="icon">
                <FaSpinner />
              </div>
              <h5>In Progress</h5>
              <div className="value">{stats.inProgressCourses}</div>
              <div className="subtitle">Active courses</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-card">
              <div className="icon">
                <FaChartLine />
              </div>
              <h5>Average Progress</h5>
              <div className="value">{stats.averageProgress}%</div>
              <div className="subtitle">Overall completion</div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
            <div className="data-card">
              <div className="card-header">
                <h5>Your Courses</h5>
              </div>
              <div className="card-body">
                {stats.courses.length === 0 ? (
                  <div className="text-center py-4">
                    <FaBook className="mb-3" style={{ fontSize: '2rem', opacity: '0.5' }} />
                    <p className="mb-4">You haven't enrolled in any courses yet.</p>
                    <Link to="/courses">
                      <button className="action-button">
                        <FaPlus className="me-2" />
                        Browse Courses
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="course-list">
                    {stats.courses.map((course) => (
                      <div key={course.id} className="course-card">
                        <h6>{course.title}</h6>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <small className="text-light">Progress</small>
                            <small className="text-light">{course.progress}%</small>
                          </div>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: `${course.progress}%` }}
                              aria-valuenow={course.progress}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            />
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <Link to={`/courses/${course.slug}`} className="flex-grow-1">
                            <button className="continue-button w-100" aria-label={`Continue course ${course.title}`}>
                              Continue Learning
                            </button>
                          </Link>
                          {course.progress === 100 && (
                            <button 
                              className="certificate-button"
                              onClick={() => handleGetCertificate(course.id)}
                              aria-label={`Get certificate for ${course.title}`}
                            >
                              Get Certificate
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="data-card">
              Origins = '<div className="card-header">
                <h5>Recommended Courses</h5>
              </div>'
              <div className="card-body">
                {stats.recommendedCourses.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="mb-4">No recommended courses.</p>
                  </div>
                ) : (
                  stats.recommendedCourses.map((course) => (
                    <div key={course.id} className="course-card">
                      <h6>{course.title}</h6>
                      <div className="d-flex align-items-center mb-3">
                        <FaUsers className="me-2 text-light opacity-75" />
                        <small className="text-light opacity-75">
                          {course.enrollment_count || 0} students enrolled
                        </small>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <FaStar className="me-2 text-warning" />
                        <small className="text-light opacity-75">
                          {course.average_rating || 0} rating
                        </small>
                      </div>
                      <Link to={`/courses/${course.slug}`}>
                        <button className="action-button secondary w-100" aria-label={`View course ${course.title}`}>
                          View Course
                        </button>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;