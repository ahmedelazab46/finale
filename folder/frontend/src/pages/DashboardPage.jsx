import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBook, FaCalendarAlt, FaChartLine, FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa'

function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for user's courses
  const enrolledCourses = [
    {
      id: 1,
      title: 'Web Development Bootcamp',
      progress: 65,
      nextLesson: 'React.js Fundamentals',
      lastAccessed: '2024-03-15'
    },
    {
      id: 2,
      title: 'Data Science Bootcamp',
      progress: 30,
      nextLesson: 'Machine Learning Basics',
      lastAccessed: '2024-03-14'
    }
  ]

  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Live Coding Session',
      date: '2024-03-20',
      time: '14:00',
      type: 'workshop'
    },
    {
      id: 2,
      title: 'Career Workshop',
      date: '2024-03-25',
      time: '15:00',
      type: 'career'
    }
  ]

  // Mock data for achievements
  const achievements = [
    {
      id: 1,
      title: 'First Project',
      description: 'Completed your first web development project',
      date: '2024-03-10'
    },
    {
      id: 2,
      title: 'Perfect Week',
      description: 'Completed all daily challenges for a week',
      date: '2024-03-15'
    }
  ]

  return (
    <div className="py-5">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4 mb-lg-0">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="text-center mb-4">
                  <img
                    src="/images/profile.jpg"
                    alt="Profile"
                    className="rounded-circle mb-3"
                    width="100"
                    height="100"
                  />
                  <h5 className="mb-1">John Doe</h5>
                  <p className="text-muted mb-0">Web Development Student</p>
                </div>

                <ul className="nav flex-column">
                  <li className="nav-item">
                    <button
                      className={`nav-link d-flex align-items-center ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                    >
                      <FaChartLine className="me-2" />
                      Overview
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link d-flex align-items-center ${activeTab === 'courses' ? 'active' : ''}`}
                      onClick={() => setActiveTab('courses')}
                    >
                      <FaBook className="me-2" />
                      My Courses
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link d-flex align-items-center ${activeTab === 'calendar' ? 'active' : ''}`}
                      onClick={() => setActiveTab('calendar')}
                    >
                      <FaCalendarAlt className="me-2" />
                      Calendar
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link d-flex align-items-center ${activeTab === 'notifications' ? 'active' : ''}`}
                      onClick={() => setActiveTab('notifications')}
                    >
                      <FaBell className="me-2" />
                      Notifications
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link d-flex align-items-center ${activeTab === 'settings' ? 'active' : ''}`}
                      onClick={() => setActiveTab('settings')}
                    >
                      <FaCog className="me-2" />
                      Settings
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link d-flex align-items-center text-danger">
                      <FaSignOutAlt className="me-2" />
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="mb-4">Dashboard Overview</h2>
                
                {/* Enrolled Courses */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <h5 className="card-title mb-4">My Courses</h5>
                    <div className="row g-4">
                      {enrolledCourses.map(course => (
                        <div key={course.id} className="col-md-6">
                          <div className="card h-100">
                            <div className="card-body">
                              <h6 className="card-title">{course.title}</h6>
                              <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                  <small>Progress</small>
                                  <small>{course.progress}%</small>
                                </div>
                                <div className="progress">
                                  <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${course.progress}%` }}
                                    aria-valuenow={course.progress}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  />
                                </div>
                              </div>
                              <p className="card-text">
                                <small className="text-muted">
                                  Next: {course.nextLesson}
                                </small>
                              </p>
                              <Link
                                to={`/courses/${course.slug}`}
                                className="btn btn-primary btn-sm"
                              >
                                Continue Learning
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <h5 className="card-title mb-4">Upcoming Events</h5>
                    <div className="list-group list-group-flush">
                      {upcomingEvents.map(event => (
                        <div key={event.id} className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1">{event.title}</h6>
                              <small className="text-muted">
                                {new Date(event.date).toLocaleDateString()} at {event.time}
                              </small>
                            </div>
                            <span className={`badge bg-${event.type === 'workshop' ? 'primary' : 'success'}`}>
                              {event.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title mb-4">Recent Achievements</h5>
                    <div className="row g-4">
                      {achievements.map(achievement => (
                        <div key={achievement.id} className="col-md-6">
                          <div className="card h-100">
                            <div className="card-body">
                              <h6 className="card-title">{achievement.title}</h6>
                              <p className="card-text">{achievement.description}</p>
                              <small className="text-muted">
                                Earned on {new Date(achievement.date).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs would be implemented similarly */}
            {activeTab !== 'overview' && (
              <div className="text-center py-5">
                <h3>Coming Soon</h3>
                <p className="text-muted">
                  This feature is under development
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage 