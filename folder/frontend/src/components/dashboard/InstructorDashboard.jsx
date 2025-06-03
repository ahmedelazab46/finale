import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaGraduationCap, 
  FaBook, 
  FaDollarSign, 
  FaStar, 
  FaPlus, 
  FaChartLine,
  FaUsers,
  FaHome,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import InstructorNavbar from '../layout/InstructorNavbar';
import '../../styles/InstructorDashboard.css';

const InstructorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
    courses: [],
    recentStudents: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // جلب الكورسات
        const coursesResponse = await axios.get('http://127.0.0.1:8000/courses/instructor/courses/', { headers });
        let courses = [];
        if (Array.isArray(coursesResponse.data)) {
          courses = coursesResponse.data;
        } else if (coursesResponse.data && Array.isArray(coursesResponse.data.courses)) {
          courses = coursesResponse.data.courses;
        } else if (coursesResponse.data && typeof coursesResponse.data === 'object') {
          courses = Object.values(coursesResponse.data);
        }

        // جلب الطلاب المسجلين
        const studentsResponse = await axios.get('http://127.0.0.1:8000/courses/instructor/enrolled-students/', { headers });
        const enrolledStudents = studentsResponse.data;

        const coursesWithStats = courses.map(course => ({
          ...course,
          enrolled_students: course.enrolled_students || [],
          total_revenue: course.total_revenue || 0,
          students_count: course.students_count || 0,
          average_rating: course.average_rating || 0
        }));

        const totalRevenue = coursesWithStats.reduce((sum, course) => {
          return sum + (parseFloat(course.total_revenue) || 0);
        }, 0);

        const averageRating = coursesWithStats.reduce((sum, course) => {
          return sum + (parseFloat(course.average_rating) || 0);
        }, 0) / (coursesWithStats.length || 1);

        setStats({
          totalCourses: courses.length,
          totalStudents: enrolledStudents.length,
          totalRevenue,
          averageRating,
          courses: coursesWithStats,
          recentStudents: enrolledStudents.slice(0, 5)
        });

        console.log('Recent Students:', enrolledStudents.slice(0, 5)); // لتصحيح الأخطاء
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          navigate('/login');
        } else {
          setError('Failed to fetch dashboard data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="instructor-dashboard">
        <InstructorNavbar />
        <div className="loading-spinner">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="instructor-dashboard">
        <InstructorNavbar />
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="instructor-dashboard">
      <InstructorNavbar />
      <div className="container">
        <div className="dashboard-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Instructor Dashboard</h2>
              <p className="text-light opacity-75 mb-0">Welcome back, {user?.email}</p>
            </div>
            <div>
              <button className="action-button me-2" onClick={() => navigate('/instructor/add-course')}>
                <FaPlus className="me-2" />
                Add New Course
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

        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="stats-card">
              <div className="icon">
                <FaBook />
              </div>
              <h5>Total Courses</h5>
              <div className="value">{stats.totalCourses}</div>
              <div className="subtitle">Published courses</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-card">
              <div className="icon">
                <FaUsers />
              </div>
              <h5>Total Students</h5>
              <div className="value">{stats.totalStudents}</div>
              <div className="subtitle">Enrolled learners</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-card">
              <div className="icon">
                <FaDollarSign />
              </div>
              <h5>Total Revenue</h5>
              <div className="value">${stats.totalRevenue.toFixed(2)}</div>
              <div className="subtitle">Earnings to date</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-card">
              <div className="icon">
                <FaStar />
              </div>
              <h5>Average Rating</h5>
              <div className="value">{stats.averageRating.toFixed(1)}</div>
              <div className="subtitle">Overall course rating</div>
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
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Course Title</th>
                      <th>Students</th>
                      <th>Revenue</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.courses.map((course) => (
                      <tr key={course.id}>
                        <td>{course.title}</td>
                        <td>{course.students_count}</td>
                        <td>${course.total_revenue.toFixed(2)}</td>
                        <td>
                          <div className="progress">
                            <div 
                              className="progress-bar" 
                              style={{ width: `${(course.average_rating / 5) * 100}%` }}
                              title={`${course.average_rating.toFixed(1)} out of 5`}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="data-card">
              <div className="card-header">
                <h5>Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button className="action-button" onClick={() => navigate('/instructor/add-course')}>
                    <FaPlus className="me-2" />
                    Create New Course
                  </button>
                  <button className="action-button" onClick={() => navigate('/instructor/courses')}>
                    <FaBook className="me-2" />
                    Manage Courses
                  </button>
                  <button className="action-button" onClick={() => navigate('/instructor/students')}>
                    <FaGraduationCap className="me-2" />
                    View Students
                  </button>
                  <button className="action-button secondary" onClick={() => navigate('/instructor/earnings')}>
                    <FaChartLine className="me-2" />
                    View Earnings
                  </button>
                </div>
              </div>
            </div>

            <div className="data-card">
              <div className="card-header">
                <h5>Recent Students</h5>
              </div>
              <div className="card-body">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Course</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentStudents.map((student, index) => (
                      <tr key={index}>
                        <td>{student.name || student.email || 'Anonymous'}</td>
                        <td>{student.course_title || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;