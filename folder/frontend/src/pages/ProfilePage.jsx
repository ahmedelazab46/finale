import React, { useState, useEffect } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa'
import api from '../utils/api'

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    linkedin: '',
    github: '',
    twitter: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/profile/')
      const userData = response.data
      setFormData({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
        phone: '',
        location: '',
        bio: '',
        linkedin: '',
        github: '',
        twitter: ''
      })
    } catch (err) {
      setError('Failed to fetch profile data')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await api.put('/profile/update/', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email
      })
      setSuccess('Profile updated successfully')
    } catch (err) {
      setError('Failed to update profile')
    }
  }

  return (
    <div className="py-5">
      <div className="container">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}
        
        <div className="row">
          {/* Profile Sidebar */}
          <div className="col-lg-3 mb-4 mb-lg-0">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="position-relative d-inline-block mb-3">
                  <img
                    src="/images/profile.jpg"
                    alt="Profile"
                    className="rounded-circle"
                    width="150"
                    height="150"
                  />
                  <button className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0">
                    <FaUser size={12} />
                  </button>
                </div>
                <h4 className="mb-1">{formData.firstName} {formData.lastName}</h4>
                <p className="text-muted mb-3">Web Development Student</p>
                <div className="d-flex justify-content-center gap-3 mb-4">
                  <a href={formData.linkedin} className="text-muted" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin size={20} />
                  </a>
                  <a href={formData.github} className="text-muted" target="_blank" rel="noopener noreferrer">
                    <FaGithub size={20} />
                  </a>
                  <a href={formData.twitter} className="text-muted" target="_blank" rel="noopener noreferrer">
                    <FaTwitter size={20} />
                  </a>
                </div>
                <div className="text-start">
                  <p className="mb-2">
                    <FaEnvelope className="me-2 text-muted" />
                    {formData.email}
                  </p>
                  <p className="mb-2">
                    <FaPhone className="me-2 text-muted" />
                    {formData.phone}
                  </p>
                  <p className="mb-0">
                    <FaMapMarkerAlt className="me-2 text-muted" />
                    {formData.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                {/* Profile Tabs */}
                <ul className="nav nav-tabs mb-4">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
                      onClick={() => setActiveTab('personal')}
                    >
                      Personal Information
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                      onClick={() => setActiveTab('security')}
                    >
                      Security
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'preferences' ? 'active' : ''}`}
                      onClick={() => setActiveTab('preferences')}
                    >
                      Preferences
                    </button>
                  </li>
                </ul>

                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="location" className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="bio" className="form-label">Bio</label>
                      <textarea
                        className="form-control"
                        id="bio"
                        name="bio"
                        rows="4"
                        value={formData.bio}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label htmlFor="linkedin" className="form-label">LinkedIn</label>
                        <input
                          type="url"
                          className="form-control"
                          id="linkedin"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="github" className="form-label">GitHub</label>
                        <input
                          type="url"
                          className="form-control"
                          id="github"
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="twitter" className="form-label">Twitter</label>
                        <input
                          type="url"
                          className="form-control"
                          id="twitter"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="text-end">
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="text-center py-5">
                    <h3>Coming Soon</h3>
                    <p className="text-muted">
                      Security settings will be available soon
                    </p>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="text-center py-5">
                    <h3>Coming Soon</h3>
                    <p className="text-muted">
                      Preference settings will be available soon
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 