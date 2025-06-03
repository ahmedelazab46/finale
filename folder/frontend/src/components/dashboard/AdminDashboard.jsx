import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Table, Container } from 'react-bootstrap';
import AdminNavbar from '../layout/AdminNavbar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalRevenue: 0,
    recentTransactions: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, transactionsRes] = await Promise.all([
          axios.get('/api/admin/dashboard/'),
          axios.get('/api/admin/payments/')
        ]);
        
        setStats({
          totalUsers: dashboardRes.data.stats.total_users,
          totalStudents: dashboardRes.data.stats.total_students,
          totalInstructors: dashboardRes.data.stats.total_instructors,
          totalCourses: dashboardRes.data.stats.total_courses,
          totalRevenue: dashboardRes.data.stats.total_payments,
          recentTransactions: transactionsRes.data.slice(0, 5)
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <AdminNavbar />
      <Container className="mt-4">
        <h2 className="mb-4">Admin Dashboard</h2>
        
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Total Users</Card.Title>
                <Card.Text className="display-6">{stats.totalUsers}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Total Students</Card.Title>
                <Card.Text className="display-6">{stats.totalStudents}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Total Instructors</Card.Title>
                <Card.Text className="display-6">{stats.totalInstructors}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Total Courses</Card.Title>
                <Card.Text className="display-6">{stats.totalCourses}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Recent Transactions</Card.Title>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Course</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentTransactions.map((tx, index) => (
                      <tr key={index}>
                        <td>{tx.student_name}</td>
                        <td>{tx.course_title}</td>
                        <td>${tx.price}</td>
                        <td>{new Date(tx.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Quick Actions</Card.Title>
                <div className="d-grid gap-2">
                  <button className="btn btn-primary">Manage Courses</button>
                  <button className="btn btn-secondary">Manage Users</button>
                  <button className="btn btn-success">View Reports</button>
                  <button className="btn btn-info">System Settings</button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminDashboard;