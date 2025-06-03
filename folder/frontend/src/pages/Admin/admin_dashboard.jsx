import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaBook, 
  FaStar, 
  FaGraduationCap, 
  FaComments, 
  FaPlus, 
  FaUserPlus, 
  FaDollarSign,
  FaChartLine,
  FaSignOutAlt,
  FaHome
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import '../../../src/styles/AdminDashboard.css';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalReviews: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    activeInstructors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('access');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('http://127.0.0.1:8000/users/admin/dashboard/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data) {
          setStats({
            totalUsers: response.data.stats.total_users || 0,
            totalStudents: response.data.stats.total_students || 0,
            totalInstructors: response.data.stats.total_instructors || 0,
            totalCourses: response.data.stats.total_courses || 0,
            totalReviews: response.data.stats.total_reviews || 0,
            totalEnrollments: response.data.stats.total_enrollments || 0,
            totalRevenue: response.data.stats.total_payments || 0,
            activeInstructors: response.data.stats.active_instructors || 0
          });
          
          if (response.data.recent_users) {
            setRecentUsers(response.data.recent_users);
          }
          if (response.data.recent_courses) {
            setRecentCourses(response.data.recent_courses);
          }
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.is_superuser) {
      fetchStats();
    } else {
      setError('You do not have permission to access this page');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
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
      <div className="admin-dashboard">
        <div className="container">
          <div className="alert alert-danger mt-4" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome back, {user?.email}</p>
          </div>
          <div className="d-flex align-items-center">
            <button className="action-button me-2" onClick={() => navigate('/admin/manage-instructors')}>
              <FaUserPlus />
              Add Instructor
            </button>
            <button className="action-button secondary me-2" onClick={() => navigate('/admin/manage-courses')}>
              <FaBook />
              Manage Courses
            </button>
            <button className="action-button secondary me-2" onClick={() => navigate('/')}>
              <FaHome />
              Back to Home
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="stats-card">
              <div className="icon">
                <FaUsers />
              </div>
              <h5>Total Users</h5>
              <div className="value">{stats.totalUsers}</div>
              <div className="subtitle">Active platform users</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-card">
              <div className="icon">
                <FaGraduationCap />
              </div>
              <h5>Students</h5>
              <div className="value">{stats.totalStudents}</div>
              <div className="subtitle">Enrolled learners</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-card">
              <div className="icon">
                <FaChalkboardTeacher />
              </div>
              <h5>Instructors</h5>
              <div className="value">{stats.totalInstructors}</div>
              <div className="subtitle">Teaching experts</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-card">
              <div className="icon">
                <FaBook />
              </div>
              <h5>Courses</h5>
              <div className="value">{stats.totalCourses}</div>
              <div className="subtitle">Available courses</div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
            <div className="data-card">
              <div className="card-header">
                <h5>Recent Users</h5>
                <button className="action-button secondary" onClick={() => navigate('/admin/manage-users')}>
                  <FaUsers />
                  View All
                </button>
              </div>
              <div className="card-body">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user, index) => (
                      <tr key={index}>
                        <td>{user.email}</td>
                        <td>{`${user.first_name} ${user.last_name}`}</td>
                        <td>
                          <span className={`badge ${user.is_instructor ? 'badge-primary' : 'badge-success'}`}>
                            {user.is_instructor ? 'Instructor' : 'Student'}
                          </span>
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
                  <button className="action-button mb-2" onClick={() => navigate('/admin/manage-students')}>
                    <FaUsers />
                    Manage Students
                  </button>
                  <button className="action-button mb-2" onClick={() => navigate('/admin/manage-courses')}>
                    <FaBook />
                    Manage Courses
                  </button>
                  <button className="action-button mb-2" onClick={() => navigate('/admin/manage-instructors')}>
                    <FaChalkboardTeacher />
                    Manage Instructors
                  </button>
                  <button className="action-button secondary">
                    <FaChartLine />
                    View Reports
                  </button>
                </div>
              </div>
            </div>

            <div className="data-card">
              <div className="card-header">
                <h5>Recent Courses</h5>
                <button className="action-button secondary" onClick={() => navigate('/admin/manage-courses')}>
                  <FaBook />
                  View All
                </button>
              </div>
              <div className="card-body">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Instructor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCourses.map((course, index) => (
                      <tr key={index}>
                        <td>{course.title}</td>
                        <td>{course.instructor}</td>
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
}
