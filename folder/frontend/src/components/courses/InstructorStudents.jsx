import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2'; // استيراد SweetAlert2
import '../../styles/InstructorStudents.css';

const InstructorStudents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const response = await axios.get('http://127.0.0.1:8000/courses/instructor/enrolled-students/', { headers });
        setStudents(response.data);
        console.log('Students:', response.data);
        response.data.forEach(student => {
          console.log(`Student ${student.name}: course_title =`, student.course_title);
        });
      } catch (error) {
        console.error('Error fetching students:', error);
        if (error.response?.status === 401) {
          // عرض تنبيه SweetAlert2 لانتهاء الجلسة
          Swal.fire({
            icon: 'error',
            title: 'Session Expired',
            text: 'Your session has expired. Please log in again.',
            confirmButtonText: 'Go to Login',
            confirmButtonColor: '#d33'
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/login');
            }
          });
          setError('Your session has expired. Please log in again.');
        } else {
          // عرض تنبيه SweetAlert2 لخطأ عام
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch students data. Please try again later.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6'
          });
          setError('Failed to fetch students data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [navigate]);

  if (loading) {
    return (
      <div className="instructor-students">
        <div className="loading-spinner">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // إزالة عرض الخطأ الثابت لأننا نستخدم SweetAlert2
  // if (error) {
  //   return (
  //     <div className="instructor-students">
  //       <div className="alert alert-danger">{error}</div>
  //     </div>
  //   );
  // }

  return (
    <div className="instructor-students">
      <div className="container">
        <div className="dashboard-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Enrolled Students</h2>
              <p className="text-light opacity-75 mb-0">Welcome back, {user?.email}</p>
            </div>
            <button
              className="action-button secondary"
              onClick={() => {
                // إضافة تأكيد SweetAlert2 عند العودة إلى لوحة التحكم
                Swal.fire({
                  icon: 'question',
                  title: 'Return to Dashboard',
                  text: 'Are you sure you want to go back to the dashboard?',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, go back',
                  cancelButtonText: 'Stay here',
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33'
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate('/instructor');
                  }
                });
              }}
            >
              <FaArrowLeft className="me-2" />
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="data-card">
          <div className="card-header">
            <h5>All Students</h5>
          </div>
          <div className="card-body">
            {students.length === 0 ? (
              <p>No students enrolled in your courses yet.</p>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Courses</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name || 'Anonymous'}</td>
                      <td>{student.email || 'No email'}</td>
                      <td>{student.phone || 'N/A'}</td>
                      <td>{student.course_title || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorStudents;