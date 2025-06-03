import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaClock, FaLevelUpAlt, FaPlayCircle } from 'react-icons/fa'
import axios from 'axios'

function MyCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('access')
        const response = await axios.get('http://127.0.0.1:8000/courses/api/enrolled-courses/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        setEnrolledCourses(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching enrolled courses:', err)
        setError('Failed to load enrolled courses. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchEnrolledCourses()
  }, [])

  const getImageUrl = (course) => {
    if (!course.courseImage) {
      return 'https://via.placeholder.com/300x200?text=No+Image'
    }
    if (course.courseImage.startsWith('http')) {
      return course.courseImage
    }
    return `http://127.0.0.1:8000${course.courseImage}`
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'success'
    if (progress >= 40) return 'warning'
    return 'danger'
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Courses</h2>
      
      {loading ? (
        <div className="text-center py-5">Loading your courses...</div>
      ) : error ? (
        <div className="text-center py-5 text-danger">{error}</div>
      ) : enrolledCourses.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">You haven't enrolled in any courses yet.</h4>
          <Link to="/courses" className="btn btn-danger mt-3">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {enrolledCourses.map(course => (
            <div key={course.id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src={getImageUrl(course)}
                  alt={course.title}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'
                  }}
                />
                
                <div className="card-body">
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

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted">Progress</small>
                      <small className="text-muted">{course.progress}%</small>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className={`progress-bar bg-${getProgressColor(course.progress)}`}
                        role="progressbar"
                        style={{ width: `${course.progress}%` }}
                        aria-valuenow={course.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-light text-dark">
                      {course.status}
                    </span>
                    <Link 
                      to={`/courses/${course.slug}`} 
                      className="btn btn-danger"
                    >
                      <FaPlayCircle className="me-1" />
                      Continue Learning
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyCourses 