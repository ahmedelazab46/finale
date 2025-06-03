import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="display-4 fw-bold mb-4">استكشف كورساتنا</h1>
        <p className="lead text-gray-600 mb-6">
          اكتشف مجموعة واسعة من الكورسات التي يقدمها خبراء الصناعة
        </p>
        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="alert alert-info">جاري تحميل الكورسات...</div>}
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="input-group mb-4">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="ابحث عن كورسات..."
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

      <div className="row">
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">الفئات</h5>
              <div className="d-flex flex-column gap-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className={`btn text-start d-flex justify-content-between align-items-center ${
                      selectedCategory === category.name ? 'btn-red' : 'btn-link text-dark'
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <span>
                      <span className="me-2">{category.icon}</span>
                      {category.name}
                    </span>
                    <span className="badge bg-gray-200 text-dark rounded-pill">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
              <hr className="my-4" />
              <h5 className="card-title mb-4">المستوى</h5>
              <div className="d-flex flex-column gap-2">
                {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <button
                    key={level}
                    className={`btn text-start ${
                      selectedLevel === level ? 'btn-red' : 'btn-link text-dark'
                    }`}
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <p className="mb-0">عرض {sortedCourses.length} كورسات</p>
            <select
              className="form-select w-auto"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">الأكثر شعبية</option>
              <option value="newest">الأحدث</option>
              <option value="price-low">السعر: من الأقل إلى الأعلى</option>
              <option value="price-high">السعر: من الأعلى إلى الأقل</option>
            </select>
          </div>

          <div className="row g-4">
            {sortedCourses.map((course) => (
              <div key={course.id} className="col-md-6">
                <div className="card h-100 border-0 shadow-sm hover-shadow-lg transition-all">
                  <img
                    src={course.courseImage || course.thumbnail}
                    className="card-img-top"
                    alt={course.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{course.title}</h5>
                    <p className="card-text text-gray-600">{course.description}</p>
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={course.instructor?.avatar || 'https://via.placeholder.com/32'}
                        alt={course.instructor?.name || 'Instructor'}
                        className="rounded-circle me-2"
                        style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                      />
                      <span className="text-gray-600">{course.instructor?.name || 'Unknown'}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        <span className="text-gray-600">{course.rating || 'N/A'}</span>
                        <span className="text-gray-400 ms-2">({course.students || 0} طلاب)</span>
                      </div>
                      <span className="h5 mb-0">${course.price}</span>
                    </div>
                  </div>
                  <div className="card-footer bg-white border-0">
                    <Link to={`/courses/${course.slug}`} className="btn btn-red w-100">
                      عرض الكورس
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;