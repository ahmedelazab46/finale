import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar style={{ 
      background: 'transparent', 
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '0.5rem 0',
      margin: 0,
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }} variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/admin/dashboard" style={{ color: 'white' }}>Admin Panel</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin/dashboard" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/admin/manage-instructors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Manage Instructors</Nav.Link>
            <Nav.Link as={Link} to="/admin/manage-courses" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Manage Courses
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/manage-students" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Manage Students
            </Nav.Link>
          </Nav>
          <Nav>
            <Dropdown align="end">
              <Dropdown.Toggle 
                variant="link" 
                id="dropdown-basic"
                style={{ 
                  color: 'white',
                  textDecoration: 'none',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '0.25rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem'
                }}
              >
                {user?.email}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ 
                background: '#2e2e4d',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginTop: '0.5rem'
              }}>
                <Dropdown.Item 
                  as={Link} 
                  to="/admin/profile"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  Profile
                </Dropdown.Item>
                <Dropdown.Divider style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} />
                <Dropdown.Item 
                  onClick={handleLogout}
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;