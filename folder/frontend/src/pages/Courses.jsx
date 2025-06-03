import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaClock, FaUserGraduate, FaStar, FaUsers, FaGraduationCap } from 'react-icons/fa';
import '../styles/Courses.css';

function CoursesPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const staticCourses = [
    {
      id: 1,
      slug: 'web-development-bootcamp',
      title: 'Web Development Bootcamp',
      description: 'Learn web development from scratch with HTML, CSS, JavaScript, and React.',
      price: 99.99,
      duration: '12 weeks',
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      instructor: {
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      },
      rating: 4.8,
      students: 1200,
      category: 'Programming',
      created_at: '2023-01-01T00:00:00Z',
    },
    {
      id: 2,
      slug: 'data-science-masterclass',
      title: 'Data Science Masterclass',
      description: 'Master data science with Python, Machine Learning, and AI.',
      price: 149.99,
      duration: '16 weeks',
      level: 'Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      instructor: {
        name: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      },
      rating: 4.9,
      students: 850,
      category: 'Data Science',
      created_at: '2023-02-01T00:00:00Z',
    },
    // أضف باقي الكورسات الثابتة
  ];

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('access');
        const headers = {};
        if (user && accessToken && accessToken !== 'undefined') {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await fetch('http://localhost:8000/courses/api/recommendations/', {
          headers,
        });
        if (!response.ok) {
          throw new Error(`خطأ HTTP! الحالة: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data.recommendations || []);
        setError(null);
      } catch (err) {
        console.error('خطأ في جلب التوصيات:', err);
        setError('فشل تحميل الكورسات الموصى بها. يتم عرض الكورسات الافتراضية.');
        setCourses(staticCourses);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [user]);

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'popular') return (b.students || 0) - (a.students || 0);
    if (sortBy === 'newest') return new Date(b.created_at || '1970-01-01') - new Date(a.created_at || '1970-01-01');
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  const categories = [
    { name: 'Programming', icon: '💻', count: 150 },
    { name: 'Design', icon: '🎨', count: 89 },
    { name: 'Business', icon: '💼', count: 120 },
    { name: 'Marketing', icon: '📊', count: 95 },
    { name: 'Photography', icon: '📸', count: 75 },
    { name: 'Music', icon: '🎵', count: 60 },
    { name: 'Data Science', icon: '📊', count: 110 },
    { name: 'Personal Development', icon: '🎯', count: 85 },
  ];

  console.log('بيانات الكورس:', courses);

const getImageUrl = (course) => {
  console.log('مسار صورة الكورس:', course.courseImage);
  if (!course.courseImage) {
    return 'https://via.placeholder.com/300x200?text=No+Image';
  }
  if (course.courseImage.startsWith('http')) {
    return course.courseImage;
  }
  return `http://127.0.0.1:8000${course.courseImage}`;
};

  return (
    <div className="courses-page">
      <div className="container">
        <div className="page-header">
          <h1 className="text-center mb-2">Explore Our Courses</h1>
          <p className="lead text-center mb-5 text-light-gray">
            Discover a wide range of courses taught by industry experts
          </p>
          
          {error && (
            <div className="alert alert-danger bg-opacity-10 text-white border-danger">
              {error}
            </div>
          )}
          
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="search-bar d-flex">
                <input
                  type="text"
                  className="form-control form-control-lg flex-grow-1"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-red">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-3">
            <div className="filters-sidebar">
              <h5>Categories</h5>
              <div className="d-flex flex-column gap-2">
                <button
                  className={`category-button ${selectedCategory === 'All' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('All')}
                >
                  <span className="d-flex align-items-center justify-content-between">
                    <span>All Categories</span>
                    <span className="badge">{courses.length}</span>
                  </span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className={`category-button ${selectedCategory === category.name ? 'active' : ''}`}
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
              </div>

              <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

              <h5>Level</h5>
              <div className="d-flex flex-column gap-2">
                {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <button
                    key={level}
                    className={`category-button ${selectedLevel === level ? 'active' : ''}`}
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <p className="mb-0 text-light-gray">Showing {sortedCourses.length} courses</p>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="row g-4">
              {sortedCourses.map((course) => (
                <div key={course.id} className="col-md-6">
                  <div className="course-card">
                    <div className="course-image">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="course-content">
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-description">{course.description}</p>
                      
                      <div className="instructor-info">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="instructor-avatar"
                        />
                        <div>
                          <div className="instructor-name">{course.instructor.name}</div>
                          <small className="text-light-gray">Instructor</small>
                        </div>
                      </div>

                      <div className="course-meta">
                        <div className="meta-item">
                          <FaClock />
                          <span>{course.duration}</span>
                        </div>
                        <div className="meta-item">
                          <FaGraduationCap />
                          <span>{course.level}</span>
                        </div>
                        <div className="meta-item">
                          <FaStar />
                          <span>{course.rating}</span>
                        </div>
                        <div className="meta-item">
                          <FaUsers />
                          <span>{course.students} students</span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="course-price">${course.price}</div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;