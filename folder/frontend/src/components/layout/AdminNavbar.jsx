import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar style={{ 
      background: 'rgba(26, 31, 44, 0.95)', 
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '0.75rem 0',
      margin: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    }} variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/admin/dashboard" style={{ 
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: '600',
          background: 'linear-gradient(to right, #fff, #a8b2d1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Le Wagon Admin
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/admin/dashboard" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                padding: '0.5rem 1rem',
                margin: '0 0.25rem',
                borderRadius: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              className="nav-link-hover"
            >
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin/manage-instructors" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                padding: '0.5rem 1rem',
                margin: '0 0.25rem',
                borderRadius: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              className="nav-link-hover"
            >
              Instructors
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin/manage-courses" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                padding: '0.5rem 1rem',
                margin: '0 0.25rem',
                borderRadius: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              className="nav-link-hover"
            >
              Courses
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin/manage-students" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                padding: '0.5rem 1rem',
                margin: '0 0.25rem',
                borderRadius: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              className="nav-link-hover"
            >
              Students
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
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaUser />
                {user?.email}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ 
                background: '#2d3748',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginTop: '0.5rem',
                borderRadius: '0.75rem',
                padding: '0.5rem'
              }}>
                <Dropdown.Item 
                  as={Link} 
                  to="/admin/profile"
                  style={{
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  className="dropdown-item-hover"
                >
                  Profile
                </Dropdown.Item>
                <Dropdown.Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                <Dropdown.Item 
                  onClick={handleLogout}
                  style={{
                    color: '#ff4b4b',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  className="dropdown-item-hover"
                >
                  <FaSignOutAlt />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <style>
        {`
          .nav-link-hover:hover {
            background: rgba(255, 255, 255, 0.05);
            color: white !important;
          }
          
          .dropdown-item-hover:hover {
            background: rgba(255, 255, 255, 0.05);
          }
        `}
      </style>
    </Navbar>
  );
};

export default AdminNavbar;