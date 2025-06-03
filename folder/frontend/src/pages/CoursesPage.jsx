import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaClock, FaLevelUpAlt } from 'react-icons/fa';
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
    'All',
    'Programming',
    'Design',
    'Marketing',
    'Business',
    'Data Science',
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const getImageUrl = (course) => {
    if (!course.courseImage) {
      return 'https://via.placeholder.com/300x200?text=No+Image';
    }
    if (course.courseImage.startsWith('http')) {
      return course.courseImage;
    }
    return `http://127.0.0.1:8000${course.courseImage}`;
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="bg-danger text-white py-5 text-center">
        <h2 className="mb-3">Discover Your Next Skill</h2>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="input-group shadow">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-dark">
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          <div className="col-md-3 mb-4">
            <h5>Filters</h5>
            <hr />
            <h6 className="text-muted">Categories</h6>
            <ul className="list-unstyled">
              {categories.map((category) => (
                <li key={category} className="mb-2">
                  <button
                    className={`btn w-100 text-start ${
                      selectedCategory === category ? 'btn-danger text-white' : 'btn-outline-danger'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>

            <h6 className="text-muted mt-4">Level</h6>
            <ul className="list-unstyled">
              {levels.map((level) => (
                <li key={level} className="mb-2">
                  <button
                    className={`btn w-100 text-start ${
                      selectedLevel === level ? 'btn-danger text-white' : 'btn-outline-danger'
                    }`}
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-9">
            {loading ? (
              <div className="text-center py-5">Loading courses...</div>
            ) : error ? (
              <div className="text-center py-5 text-danger">{error}</div>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <p className="mb-0">Showing {courses.length} course(s)</p>
                  <select className="form-select w-auto">
                    <option>Most Popular</option>
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>

                <div className="row g-4">
                  {courses.map((course) => (
                    <div key={course.id} className="col-md-6 col-lg-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <img
                          src={getImageUrl(course)}
                          alt={course.title}
                          className="card-img-top"
                          style={{ height: '200px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
                        />
                        <div className="card-body bg-light">
                          <h5 className="card-title">{course.title}</h5>
                          <p className="card-text text-muted">
                            {course.description?.substring(0, 60)}...
                          </p>
                          <div className="d-flex gap-3 mb-3">
                            <small className="text-muted">
                              <FaClock className="me-1" />
                              {course.duration} hours
                            </small>
                            <small className="text-muted">
                              <FaLevelUpAlt className="me-1" />
                              {course.level}
                            </small>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="h5 mb-0">
                              {course.price == null || course.price === 0 ? 'Free' : `$${course.price}`}
                            </span>
                            <Link to={`/courses/${course.slug}`} className="btn btn-danger">
                              Enroll Now
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