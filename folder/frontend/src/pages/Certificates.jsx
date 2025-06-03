import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDownload, FaShare, FaEye, FaGraduationCap } from 'react-icons/fa';
import '../styles/Certificates.css';
const API_BASE_URL = 'http://127.0.0.1:8000';
const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          throw new Error('No access token found');
        }

        const response = await axios.get(
          'http://127.0.0.1:8000/courses/student/certificate/<int:course_id>/',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );

        setCertificates(response.data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        setError('Failed to load certificates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleDownload = async (certificateId) => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/courses/student/certificates/${certificateId}/download/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      setError('Failed to download certificate. Please try again later.');
    }
  };

  const handleShare = async (certificateId) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Course Certificate',
          text: 'Check out my course completion certificate!',
          url: `${window.location.origin}/certificates/${certificateId}`
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const certificateUrl = `${window.location.origin}/certificates/${certificateId}`;
        await navigator.clipboard.writeText(certificateUrl);
        alert('Certificate link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing certificate:', error);
    }
  };

  if (loading) {
    return (
      <div className="certificates-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="certificates-page">
      <div className="container">
        <div className="page-header">
          <h2>My Certificates</h2>
          <p className="text-light opacity-75">View and download your course completion certificates</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {certificates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaGraduationCap />
            </div>
            <h3>No Certificates Yet</h3>
            <p>Complete your courses to earn certificates!</p>
          </div>
        ) : (
          <div className="row g-4">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="col-md-6 col-lg-4">
                <div className="certificate-card">
                  <div className="certificate-preview">
                    <img
                      src={certificate.preview_url || '/images/certificate-placeholder.png'}
                      alt={`${certificate.course_title} Certificate`}
                    />
                    <div className="certificate-overlay">
                      <button
                        className="preview-button"
                        onClick={() => window.open(certificate.preview_url, '_blank')}
                      >
                        <FaEye />
                        Preview
                      </button>
                    </div>
                  </div>
                  <div className="certificate-info">
                    <h3>{certificate.course_title}</h3>
                    <p className="completion-date">
                      Completed on {new Date(certificate.completion_date).toLocaleDateString()}
                    </p>
                    <div className="certificate-actions">
                      <button
                        className="action-button"
                        onClick={() => handleDownload(certificate.id)}
                      >
                        <FaDownload className="me-2" />
                        Download
                      </button>
                      <button
                        className="action-button secondary"
                        onClick={() => handleShare(certificate.id)}
                      >
                        <FaShare className="me-2" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates; 