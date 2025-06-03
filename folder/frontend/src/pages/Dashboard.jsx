import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stats] = useState({
    enrolledCourses: 3,
    learningHours: 45,
    certificates: 2,
    monthlyHours: 15,
    completedLessons: 45,
    achievements: 8,
    averageHoursPerDay: 2.5,
    streak: 7,
    totalPoints: 1250,
    rank: "Silver Scholar",
    completionRate: 75,
    quizScore: 85,
    discussionPosts: 12
  });

  const [enrolledCourses] = useState([
    {
      id: 1,
      title: 'Web Development Bootcamp',
      progress: 75,
      lastAccessed: '2 days ago',
      nextLesson: 'React Hooks',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Data Science Masterclass',
      progress: 45,
      lastAccessed: '1 day ago',
      nextLesson: 'Machine Learning Basics',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      progress: 90,
      lastAccessed: '3 days ago',
      nextLesson: 'Final Project',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ]);

  const [recommendedCourses] = useState([
    {
      id: 4,
      title: 'Mobile App Development',
      instructor: 'David Chen',
      rating: 4.9,
      students: 780,
      price: 129.99,
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      title: 'Digital Marketing Strategy',
      instructor: 'Sarah Wilson',
      rating: 4.6,
      students: 920,
      price: 89.99,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ]);

  return (
    <div className="container py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, Student!</h1>
            <p className="text-blue-100 text-lg">Ready to continue your learning journey?</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold">{stats.rank}</p>
            <p className="text-blue-200">{stats.totalPoints} XP</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <div className="flex items-center mb-2">
              <i className="bi bi-book me-2"></i>
              <span>Enrolled Courses</span>
            </div>
            <p className="text-2xl font-bold">{stats.enrolledCourses}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <div className="flex items-center mb-2">
              <i className="bi bi-clock me-2"></i>
              <span>Learning Hours</span>
            </div>
            <p className="text-2xl font-bold">{stats.learningHours}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <div className="flex items-center mb-2">
              <i className="bi bi-award me-2"></i>
              <span>Certificates</span>
            </div>
            <p className="text-2xl font-bold">{stats.certificates}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <div className="flex items-center mb-2">
              <i className="bi bi-lightning me-2"></i>
              <span>Day Streak</span>
            </div>
            <p className="text-2xl font-bold">{stats.streak} days</p>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8">
          {/* Courses in Progress */}
          <div className="card border-0 shadow-sm mb-6">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 mb-0">Courses in Progress</h2>
                <Link to="/courses" className="btn btn-link text-decoration-none">
                  View All <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
              <div className="row g-4">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm">
                      <img
                        src={course.thumbnail}
                        className="card-img-top"
                        alt={course.title}
                        style={{ height: '160px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{course.title}</h5>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-gray-600">Progress</small>
                            <small className="text-gray-600">{course.progress}%</small>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div
                              className="progress-bar bg-primary"
                              role="progressbar"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-gray-600">
                            Last accessed: {course.lastAccessed}
                          </small>
                          <Link to={`/courses/${course.slug}`} className="btn btn-sm btn-primary">
                            Continue
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Statistics */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h4 mb-4">Learning Statistics</h2>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <i className="bi bi-graph-up text-primary fs-4"></i>
                      <span className="text-gray-600 small">This Month</span>
                    </div>
                    <p className="h3 mb-1">{stats.monthlyHours}</p>
                    <p className="text-gray-600 mb-0">Learning Hours</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <i className="bi bi-book text-success fs-4"></i>
                      <span className="text-gray-600 small">Total</span>
                    </div>
                    <p className="h3 mb-1">{stats.completedLessons}</p>
                    <p className="text-gray-600 mb-0">Completed Lessons</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <i className="bi bi-award text-warning fs-4"></i>
                      <span className="text-gray-600 small">Achievements</span>
                    </div>
                    <p className="h3 mb-1">{stats.achievements}</p>
                    <p className="text-gray-600 mb-0">Badges Earned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Recommended Courses */}
          <div className="card border-0 shadow-sm mb-6">
            <div className="card-body">
              <h2 className="h4 mb-4">Recommended for You</h2>
              <div className="d-flex flex-column gap-4">
                {recommendedCourses.map(course => (
                  <div key={course.id} className="d-flex gap-3">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="rounded"
                      style={{ width: '100px', height: '60px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="mb-1">{course.title}</h6>
                      <p className="text-gray-600 small mb-2">
                        by {course.instructor}
                      </p>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-star-fill text-warning"></i>
                        <span className="small">{course.rating}</span>
                        <span className="text-gray-600 small">({course.students} students)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h4 mb-4">Quick Links</h2>
              <div className="row g-3">
                <div className="col-6">
                  <Link to="/discussion" className="card border-0 shadow-sm text-decoration-none">
                    <div className="card-body text-center">
                      <i className="bi bi-chat-dots text-primary fs-4 mb-2"></i>
                      <p className="text-gray-800 mb-0 small">Discussion Forum</p>
                    </div>
                  </Link>
                </div>
                <div className="col-6">
                  <Link to="/resources" className="card border-0 shadow-sm text-decoration-none">
                    <div className="card-body text-center">
                      <i className="bi bi-file-text text-primary fs-4 mb-2"></i>
                      <p className="text-gray-800 mb-0 small">Study Materials</p>
                    </div>
                  </Link>
                </div>
                <div className="col-6">
                  <Link to="/community" className="card border-0 shadow-sm text-decoration-none">
                    <div className="card-body text-center">
                      <i className="bi bi-people text-primary fs-4 mb-2"></i>
                      <p className="text-gray-800 mb-0 small">Community</p>
                    </div>
                  </Link>
                </div>
                <div className="col-6">
                  <Link to="/rewards" className="card border-0 shadow-sm text-decoration-none">
                    <div className="card-body text-center">
                      <i className="bi bi-gift text-primary fs-4 mb-2"></i>
                      <p className="text-gray-800 mb-0 small">Rewards</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 