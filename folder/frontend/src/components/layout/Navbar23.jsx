import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaBook, 
  FaUser, 
  FaComments, 
  FaBars, 
  FaTimes, 
  FaSearch, 
  FaLanguage, 
  FaSignOutAlt, 
  FaInfoCircle, 
  FaEnvelope, 
  FaHome,
  FaGraduationCap,
  FaSignInAlt,
  FaLightbulb,
  FaBookReader,
  FaPaperPlane
} from 'react-icons/fa';
import './Navbar.css';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';

const menuItems = [
  { label: 'Home', path: '/', icon: FaHome, auth: false },
  { label: 'Courses', path: '/courses', icon: FaBook, auth: false },
  { label: 'About', path: '/about', icon: FaInfoCircle, auth: false },
  { label: 'Contact', path: '/contact', icon: FaEnvelope, auth: false },
  { label: 'Dashboard', path: '/dashboard', icon: FaUser, auth: true },
];

const languages = [
  { code: 'EN', name: 'English' },
  { code: 'AR', name: 'عربي' },
  { code: 'FR', name: 'Français' },
  { code: 'ES', name: 'Español' },
  { code: 'DE', name: 'Deutsch' }
];

function Navbar23() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <Navbar 
      expand="lg" 
      fixed="top"
      className={`ultra-modern-navbar ${isScrolled ? 'scrolled' : ''}`}
    >
      <Container>
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="ultra-modern-brand"
        >
          <img 
            src="https://avatars.githubusercontent.com/u/5470001"
            alt=""
            height="40" 
            width="40"
            className="brand-image"
          />
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="ultra-modern-toggler"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="toggle-icon-container">
            {isMenuOpen ? <FaTimes className="toggle-icon" /> : <FaBars className="toggle-icon" />}
          </div>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto nav-links-container">
            {menuItems.map((item) => (
              (!item.auth || (item.auth && isLoggedIn)) && (
                <Nav.Link 
                  key={item.path}
                  as={Link} 
                  to={item.path} 
                  className={`ultra-modern-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <div className="nav-link-content">
                    <item.icon className="nav-icon" />
                    <span>{item.label}</span>
                  </div>
                </Nav.Link>
              )
            ))}
          </Nav>

          <Nav className="ultra-modern-right-nav">
            <Dropdown align="end" className="ultra-modern-dropdown">
              <Dropdown.Toggle variant="link" className="ultra-modern-lang-selector">
                <div className="lang-selector-content">
                  <FaLanguage className="lang-icon" />
                  <span>{selectedLang.code}</span>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="ultra-modern-dropdown-menu">
                {languages.map((lang) => (
                  <Dropdown.Item 
                    key={lang.code}
                    onClick={() => setSelectedLang(lang)}
                    className={`ultra-modern-dropdown-item ${selectedLang.code === lang.code ? 'active' : ''}`}
                  >
                    <span className="lang-name">{lang.name}</span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {!isLoggedIn ? (
              <div className="ultra-modern-auth-buttons">
                <Button 
                  as={Link}
                  to="/login" 
                  variant="link" 
                  className="ultra-modern-login-btn"
                >
                  Login
                </Button>
                <Button 
                  as={Link}
                  to="/signup"
                  variant="primary" 
                  className="ultra-modern-signup-btn"
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline-danger" 
                className="ultra-modern-logout-btn"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="logout-icon" />
                <span>Logout</span>
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbar23; 