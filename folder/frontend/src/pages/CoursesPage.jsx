import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaClock, FaLevelUpAlt, FaUsers, FaStar } from 'react-icons/fa';
import axios from 'axios';
import './CoursesPage.css';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (selectedLevel !== 'All') params.append('level', selectedLevel);

        const response = await axios.get(
          `http://127.0.0.1:8000/courses/api/courses/?${params.toString()}`
        );
        setCourses(response.data.courses || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [searchTerm, selectedCategory, selectedLevel]);

  const categories = [
    { name: 'All', icon: '🎯', count: courses.length },
    { name: 'Programming', icon: '💻', count: 150 },
    { name: 'Design', icon: '🎨', count: 89 },
    { name: 'Marketing', icon: '📊', count: 95 },
    { name: 'Business', icon: '💼', count: 120 },
    { name: 'Data Science', icon: '📈', count: 110 },
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const getImageUrl = (course) => {
    if (!course.courseImage) {
      return '/default-course.png';
    }
    
    if (course.courseImage.startsWith('/media')) {
      return `http://127.0.0.1:8000${course.courseImage}`;
    }
    
    if (course.courseImage.startsWith('http')) {
      return course.courseImage;
    }
    
    return `http://127.0.0.1:8000${course.courseImage}`;
  };

  

  return (
    <div className="courses-page">
      <section className="hero-section">
        <div className="container">
          <h2 className="text-center">Discover Your Next Skill</h2>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search for courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <FaSearch />
            </button>
          </div>
        </div>
      </section>

      <div className="container">
        {error && (
          <div className="alert" style={{ background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', border: '1px solid rgba(220, 53, 69, 0.2)', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <div className="row g-4">
          <div className="col-md-3">
            <div className="filters-section">
              <h5>Categories</h5>
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`filter-button ${selectedCategory === category.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <span className="d-flex align-items-center justify-content-between">
                    <span>
                      <span className="me-2">{category.icon}</span>
                      {category.name}
                    </span>
                    <span className="badge">{category.count}</span>
                  </span>
                </button>
              ))}

              <h5 className="mt-4">Level</h5>
              {levels.map((level) => (
                <button
                  key={level}
                  className={`filter-button ${selectedLevel === level ? 'active' : ''}`}
                  onClick={() => setSelectedLevel(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="col-md-9">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <p className="mb-0 text-light-gray">Showing {courses.length} course(s)</p>
                  <select className="sort-select">
                    <option>Most Popular</option>
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>

                <div className="row g-4">
                  {courses.map((course) => (
                    <div key={course.id} className="col-md-6">
                      <div className="course-card">
                        <div className="course-image">
                          <img
                            src={getImageUrl(course)}
                            alt={course.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/default-course.png';
                            }}
                          />
                        </div>
                        <div className="course-content">
                          <h3 className="course-title">{course.title}</h3>
                          <p className="course-description">
                            {course.description?.substring(0, 100)}...
                          </p>
                          
                          <div className="course-meta">
                            <div className="meta-item">
                              <FaClock />
                              <span>{course.duration} hours</span>
                            </div>
                            <div className="meta-item">
                              <FaLevelUpAlt />
                              <span>{course.level}</span>
                            </div>
                            {course.rating && (
                              <div className="meta-item">
                                <FaStar />
                                <span>{course.rating}</span>
                              </div>
                            )}
                            {course.enrolled_students && (
                              <div className="meta-item">
                                <FaUsers />
                                <span>{course.enrolled_students} students</span>
                              </div>
                            )}
                          </div>

                          <div className="d-flex justify-content-between align-items-center">
                            <div className="course-price">
                              {course.price == null || course.price === 0 ? 'Free' : `$${course.price}`}
                            </div>
                            <Link to={`/courses/${course.slug}`} className="enroll-button">
                              Learn More
                              <i className="bi bi-arrow-right ms-2"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;