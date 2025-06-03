import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaTachometerAlt, 
  FaBook, 
  FaPlus, 
  FaUserGraduate, 
  FaChartLine, 
  FaUser,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import '../../styles/InstructorNavbar.css';

const InstructorNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: '/instructor/dashboard', icon: <FaTachometerAlt />, text: 'Dashboard' },
    { path: '/instructor/courses', icon: <FaBook />, text: 'My Courses' },
    { path: '/instructor/add-course', icon: <FaPlus />, text: 'Add Course' },
    { path: '/instructor/students', icon: <FaUserGraduate />, text: 'Students' },
    { path: '/instructor/profile', icon: <FaUser />, text: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="instructor-navbar">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/instructor/dashboard" className="navbar-brand">
            Instructor Panel
          </Link>

          <button 
            className="navbar-toggler d-lg-none" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div className={`navbar-collapse ${isOpen ? 'd-lg-block' : 'd-none d-lg-block'}`}>
            <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.icon}
                  {item.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default InstructorNavbar;