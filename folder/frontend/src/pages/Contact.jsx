import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Modal } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
// import './Contact.css'; // Import the CSS file

function Contact() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/contact/api/contact/', // Corrected URL
        data: formData,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      setShowSuccessModal(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus({
        type: 'danger',
        message: error.response?.data?.error || error.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { title: 'Program Details', link: '/faq#program' },
    { title: 'Payment Options', link: '/faq#payment' },
    { title: 'Schedule Info', link: '/faq#schedule' },
    { title: 'Career Support', link: '/faq#career' },
  ];

  return (
    <div className="bg-dark text-white">
      {/* Hero Section */}
      <div className="position-relative py-5" style={{ backgroundColor: '#111111' }}>
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(45deg, rgba(220, 53, 69, 0.1) 0%, rgba(0, 0, 0, 0) 100%)',
            zIndex: 1,
          }}
        ></div>
        <Container className="position-relative" style={{ zIndex: 2 }}>
          <Row className="text-center py-5">
            <Col data-aos="fade-up">
              <h1 className="display-4 fw-bold mb-4">Get in Touch</h1>
              <p className="lead" style={{ opacity: 0.8, maxWidth: '800px', margin: '0 auto' }}>
                Have questions about our bootcamp? We're here to help! Reach out to us and we'll get back to you as soon as possible.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Quick Links */}
      <div className="py-4" style={{ backgroundColor: '#151515' }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="d-flex flex-wrap justify-content-center gap-3" data-aos="fade-up">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.link}
                    className="btn btn-outline-danger"
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Contact Form Section */}
      <div className="py-5" style={{ backgroundColor: '#1A1A1A' }}>
        <Container>
          <Row className="g-5">
            {/* Contact Information */}
            <Col lg={4} data-aos="fade-right">
              <div className="mb-5">
                <h2 className="h3 mb-4">Contact Information</h2>
                <div className="contact-info-item d-flex align-items-center mb-4">
                  <FaMapMarkerAlt size={24} className="text-danger me-3" />
                  <div>
                    <h3 className="h6 mb-1">Address</h3>
                    <p style={{ opacity: 0.8 }}>123 Coding Street, Tech City, 12345</p>
                  </div>
                </div>
                <div className="contact-info-item d-flex align-items-center mb-4">
                  <FaPhone size={24} className="text-danger me-3" />
                  <div>
                    <h3 className="h6 mb-1">Phone</h3>
                    <p style={{ opacity: 0.8 }}>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="contact-info-item d-flex align-items-center mb-4">
                  <FaEnvelope size={24} className="text-danger me-3" />
                  <div>
                    <h3 className="h6 mb-1">Email</h3>
                    <p style={{ opacity: 0.8 }}>contact@lewagon.com</p>
                  </div>
                </div>
                <div className="contact-info-item d-flex align-items-center mb-4">
                  <FaWhatsapp size={24} className="text-danger me-3" />
                  <div>
                    <h3 className="h6 mb-1">WhatsApp</h3>
                    <p style={{ opacity: 0.8 }}>+1 (555) 987-6543</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="h3 mb-4">Follow Us</h2>
                <div className="d-flex gap-3">
                  <a href="#" className="social-link">
                    <FaLinkedin size={24} />
                  </a>
                  <a href="#" className="social-link">
                    <FaTwitter size={24} />
                  </a>
                  <a href="#" className="social-link">
                    <FaFacebook size={24} />
                  </a>
                </div>
              </div>
            </Col>

            {/* Contact Form */}
            <Col lg={8} data-aos="fade-left">
              <div
                className="bg-dark p-4 rounded"
                style={{
                  background: 'linear-gradient(145deg, #1a1a1a 0%, #111111 100%)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                <h2 className="h3 mb-4">Send us a Message</h2>
                {status.message && (
                  <Alert variant={status.type} className="mb-4">
                    {status.message}
                  </Alert>
                )}
                <Form onSubmit={handleSubmit} noValidate>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                          className={`form-control-custom ${errors.name ? 'border-danger' : ''}`}
                          isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Your email"
                          className={`form-control-custom ${errors.email ? 'border-danger' : ''}`}
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="Message subject"
                          className={`form-control-custom ${errors.subject ? 'border-danger' : ''}`}
                          isInvalid={!!errors.subject}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.subject}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          placeholder="Your message"
                          className={`form-control-custom ${errors.message ? 'border-danger' : ''}`}
                          isInvalid={!!errors.message}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Button
                        type="submit"
                        variant="danger"
                        size="lg"
                        className="px-5 submit-btn"
                        disabled={loading}
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Map Section */}
      <div className="py-5" style={{ backgroundColor: '#111111' }}>
        <Container>
          <Row>
            <Col data-aos="fade-up">
              <div className="ratio ratio-21x9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.142047744348!2d2.3354330160472316!3d48.87456857928921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e38f817b573%3A0x48d69c30470e7aeb!2sLe%20Wagon!5e0!3m2!1sen!2sus!4v1635517714619!5m2!1sen!2sus"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
        className="text-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Message Sent Successfully!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Thank you for reaching out! We've received your message and will get back to you as soon as possible.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Contact;