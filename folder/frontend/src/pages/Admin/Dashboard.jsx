import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaUsers, FaBook, FaGraduationCap, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get('http://localhost:8000/users/admin/dashboard/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStats(response.data.stats);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Total Users</h6>
                  <h3>{stats.total_users}</h3>
                </div>
                <FaUsers size={40} className="text-primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Total Courses</h6>
                  <h3>{stats.total_courses}</h3>
                </div>
                <FaBook size={40} className="text-success" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Total Enrollments</h6>
                  <h3>{stats.total_enrollments}</h3>
                </div>
                <FaGraduationCap size={40} className="text-warning" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Management Section */}
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">User Management</h5>
            </Card.Header>
            <Card.Body>
              <Button 
                variant="primary" 
                className="me-2"
                onClick={() => navigate('/admin/manage-instructors')}
              >
                <FaUserPlus className="me-2" />
                Manage Instructors
              </Button>
              <Button 
                variant="secondary"
                onClick={() => navigate('/admin/users')}
              >
                <FaUsers className="me-2" />
                Manage Users
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Course Management</h5>
            </Card.Header>
            <Card.Body>
              <Button 
                variant="primary"
                onClick={() => navigate('/admin/courses')}
              >
                <FaBook className="me-2" />
                Manage Courses
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard; 