import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaSearch, FaArrowLeft } from 'react-icons/fa'

function NotFoundPage() {
  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h1 className="display-1 fw-bold text-primary mb-4">404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="lead text-muted mb-5">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>

            <div className="d-flex justify-content-center gap-3 mb-5">
              <Link to="/" className="btn btn-primary">
                <FaHome className="me-2" />
                Go Home
              </Link>
              <button
                className="btn btn-outline-primary"
                onClick={() => window.history.back()}
              >
                <FaArrowLeft className="me-2" />
                Go Back
              </button>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">Looking for something specific?</h5>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaSearch className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search our website..."
                  />
                  <button className="btn btn-primary">
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <h5 className="mb-4">Popular Pages</h5>
              <div className="row g-4">
                <div className="col-md-4">
                  <Link to="/courses" className="text-decoration-none">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="card-title mb-0">Courses</h6>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link to="/about" className="text-decoration-none">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="card-title mb-0">About Us</h6>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link to="/contact" className="text-decoration-none">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="card-title mb-0">Contact</h6>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage 