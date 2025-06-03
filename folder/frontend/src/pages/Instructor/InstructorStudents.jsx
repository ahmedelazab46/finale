import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaSearch, FaFilter } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import InstructorNavbar from '../../components/layout/InstructorNavbar';
import '../../styles/InstructorStudents.css';

const InstructorStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        'http://127.0.0.1:8000/courses/instructor/enrolled-students/',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students data');
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = (student.name || student.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.course_title || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && student.is_active;
    if (filter === 'completed') return matchesSearch && student.has_completed;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="instructor-students">
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
      <div className="instructor-students">
        <InstructorNavbar />
        <div className="container">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="instructor-students">
      <InstructorNavbar />
      <div className="container">
        <div className="dashboard-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Students</h2>
              <p className="text-light opacity-75 mb-0">Manage your enrolled students</p>
            </div>
          </div>
        </div>

        <div className="data-card">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h5>All Students</h5>
              <div className="d-flex gap-3">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <select 
                  className="filter-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Students</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
          <div className="card-body">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Enrollment Date</th>
                  <th>Progress</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="student-avatar">
                          <FaUserGraduate />
                        </div>
                        <div className="ms-2">
                          <div className="student-name">{student.name || 'Anonymous'}</div>
                          <div className="student-email">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{student.course_title || 'N/A'}</td>
                    <td>{new Date(student.enrollment_date).toLocaleDateString()}</td>
                    <td>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: `${student.progress || 0}%` }}
                          title={`${student.progress || 0}% Complete`}
                        />
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${student.has_completed ? 'completed' : 'active'}`}>
                        {student.has_completed ? 'Completed' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorStudents; 