import React, { useState } from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { FaBook, FaGraduationCap, FaUser, FaSignOutAlt, FaHome, FaBars } from 'react-icons/fa'

function StudentNavbar() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    navigate('/login')
  }

  return (
    <Navbar expand="lg" className="navbar-dark student-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img 
            src="/lewagon-logo.png" 
            alt="LeWagon" 
            height="30" 
            className="me-2"
            onError={(e) => {
              e.target.src = 'https://www.lewagon.com/assets/v4/logo-lewagon-9c19fb39a748cd3b1f49059ce0dc6c0dfc4cc2447d5a9a3e01bd2d5a214faf3c.svg'
            }}
          />
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="border-0"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars />
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/student/dashboard" className="px-3">
              <FaHome className="me-2" />
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/student/courses" className="px-3">
              <FaBook className="me-2" />
              My Courses
            </Nav.Link>
            <Nav.Link as={Link} to="/student/certificates" className="px-3">
              <FaGraduationCap className="me-2" />
              Certificates
            </Nav.Link>
            <Nav.Link as={Link} to="/student/profile" className="px-3">
              <FaUser className="me-2" />
              Profile
            </Nav.Link>
            <Button 
              variant="outline-danger"
              className="ms-3"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default StudentNavbar