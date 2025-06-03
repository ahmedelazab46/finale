import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Dropdown } from 'react-bootstrap'
import { 
  FaSearch, FaBook, FaGraduationCap, FaUser, FaCreditCard, 
  FaQuestionCircle, FaArrowRight, FaVideo, FaComments, FaTimes,
  FaPlay 
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'

function HelpCenter() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    })
  }, [])

  const [searchTerm, setSearchTerm] = useState('')
  const [showChatWidget, setShowChatWidget] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  const helpCategories = [
    {
      title: "Getting Started",
      icon: <FaBook size={24} />,
      description: "Learn about our bootcamps and how to get started",
      topics: [
        "What is Le Wagon?",
        "How to apply",
        "Prerequisites",
        "Bootcamp schedule"
      ]
    },
    {
      title: "Learning Journey",
      icon: <FaGraduationCap size={24} />,
      description: "Everything about your learning experience",
      topics: [
        "Curriculum details",
        "Learning methodology",
        "Projects",
        "Certification"
      ]
    },
    {
      title: "Career Support",
      icon: <FaUser size={24} />,
      description: "Career guidance and job search support",
      topics: [
        "Job placement",
        "Career coaching",
        "Networking events",
        "Alumni network"
      ]
    },
    {
      title: "Payment & Finance",
      icon: <FaCreditCard size={24} />,
      description: "Information about payments and financing",
      topics: [
        "Tuition fees",
        "Payment plans",
        "Scholarships",
        "Refund policy"
      ]
    }
  ]

  const popularQuestions = [
    {
      question: "How long is the bootcamp?",
      answer: "Our full-time bootcamp is 9 weeks long, while our part-time program runs for 24 weeks."
    },
    {
      question: "Do I need prior coding experience?",
      answer: "No prior coding experience is required. Our bootcamp is designed for beginners."
    },
    {
      question: "What kind of jobs can I get after the bootcamp?",
      answer: "Graduates typically find jobs as Full-Stack Developers, Front-end Developers, or Back-end Developers."
    },
    {
      question: "How much does the bootcamp cost?",
      answer: "The cost varies by location. Please check our website for the most up-to-date pricing in your region."
    }
  ]

  const videoTutorials = [
    {
      title: "Introduction to Web Development",
      duration: "15:30",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      description: "Learn the basics of web development and get started with your coding journey."
    },
    {
      title: "Getting Started with Ruby",
      duration: "12:45",
      thumbnail: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      description: "Master the fundamentals of Ruby programming language."
    },
    {
      title: "JavaScript Fundamentals",
      duration: "18:20",
      thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      description: "Dive deep into JavaScript and understand core concepts."
    }
  ]

  const handleSearch = (term) => {
    setSearchTerm(term)
    // Simple search implementation
    const results = [...popularQuestions, ...helpCategories.flatMap(cat => 
      cat.topics.map(topic => ({ question: topic }))
    )].filter(item => 
      item.question.toLowerCase().includes(term.toLowerCase())
    )
    setSearchResults(results)
  }

  return (
    <div className="bg-dark text-white min-vh-100">
      {/* Hero Section */}
      <div className="py-5 position-relative overflow-hidden" style={{ 
        backgroundColor: '#111111',
        backgroundImage: 'url(https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ 
          background: 'linear-gradient(45deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%)',
          zIndex: 1
        }}></div>
        <Container className="position-relative" style={{ zIndex: 2 }}>
          <Row className="text-center py-5">
            <Col data-aos="fade-up">
              <h1 className="display-4 fw-bold mb-4">How can we help you?</h1>
              <p className="lead mb-5" style={{ opacity: 0.8, maxWidth: '800px', margin: '0 auto' }}>
                Find answers to your questions about our bootcamps, admissions process, and career support.
              </p>
              
              {/* Search Bar */}
              <div className="position-relative mx-auto" style={{ maxWidth: '600px' }}>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-dark border-secondary">
                    <FaSearch className="text-white-50" />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary search-input"
                    placeholder="Search for help..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                {searchTerm && searchResults.length > 0 && (
                  <div className="search-results">
                    {searchResults.map((result, index) => (
                      <div key={index} className="search-result-item">
                        <FaQuestionCircle className="text-danger me-2" />
                        {result.question}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Categories Section */}
      <div className="py-5" style={{ backgroundColor: '#1A1A1A' }}>
        <Container>
          <h2 className="h3 mb-5 text-center" data-aos="fade-up">Browse by Category</h2>
          <Row className="g-4">
            {helpCategories.map((category, index) => (
              <Col key={index} md={6} lg={3} data-aos="fade-up" data-aos-delay={index * 100}>
                <Card className="h-100 bg-dark border-secondary category-card">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <div className="text-danger me-3">
                        {category.icon}
                      </div>
                      <h3 className="h5 mb-0">{category.title}</h3>
                    </div>
                    <p className="text-white-50 mb-4">{category.description}</p>
                    <ul className="list-unstyled mb-0">
                      {category.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="mb-2">
                          <Link to="/faq" className="text-white-50 text-decoration-none d-flex align-items-center topic-link">
                            <FaArrowRight className="me-2" size={12} />
                            {topic}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Video Tutorials Section */}
      <div className="py-5" style={{ backgroundColor: '#111111' }}>
        <Container>
          <h2 className="h3 mb-5 text-center" data-aos="fade-up">Video Tutorials</h2>
          <Row className="g-4">
            {videoTutorials.map((video, index) => (
              <Col key={index} md={4} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="video-card position-relative">
                  <div className="video-thumbnail">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-100 rounded"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="video-overlay">
                      <div className="play-button">
                        <FaPlay size={30} />
                      </div>
                      <span className="duration">{video.duration}</span>
                    </div>
                  </div>
                  <div className="video-info mt-3">
                    <h4 className="h6 mb-2">{video.title}</h4>
                    <p className="text-white-50 small mb-0">{video.description}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Popular Questions Section */}
      <div className="py-5" style={{ backgroundColor: '#1A1A1A' }}>
        <Container>
          <h2 className="h3 mb-5 text-center" data-aos="fade-up">Popular Questions</h2>
          <Row className="g-4">
            {popularQuestions.map((item, index) => (
              <Col key={index} md={6} data-aos="fade-up" data-aos-delay={index * 100}>
                <Card className="h-100 bg-dark border-secondary question-card">
                  <Card.Body>
                    <div className="d-flex align-items-start">
                      <FaQuestionCircle className="text-danger me-3 mt-1" size={20} />
                      <div>
                        <h3 className="h5 mb-3">{item.question}</h3>
                        <p className="text-white-50 mb-0">{item.answer}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Contact Section */}
      <div className="py-5 position-relative" style={{ backgroundColor: '#111111' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ 
          background: 'linear-gradient(45deg, rgba(220, 53, 69, 0.2) 0%, rgba(0,0,0,0.8) 100%)',
          zIndex: 1
        }}></div>
        <Container className="position-relative" style={{ zIndex: 2 }}>
          <Row className="text-center">
            <Col data-aos="fade-up">
              <h2 className="h3 mb-4">Still need help?</h2>
              <p className="lead mb-4" style={{ opacity: 0.8 }}>
                Our team is here to help! Contact us for more information.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link 
                  to="/contact" 
                  className="btn btn-danger btn-lg px-5 py-3 rounded-pill contact-btn"
                >
                  Contact Us
                </Link>
                <Link 
                  to="/faq" 
                  className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill faq-btn"
                >
                  View All FAQs
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Chat Widget */}
      {showChatWidget ? (
        <div className="chat-widget">
          <div className="chat-header">
            <h5 className="mb-0">Live Chat Support</h5>
            <button className="btn btn-link text-white p-0" onClick={() => setShowChatWidget(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="chat-body">
            <div className="chat-message support">
              Hi! How can we help you today?
            </div>
          </div>
          <div className="chat-footer">
            <input type="text" placeholder="Type your message..." className="form-control" />
          </div>
        </div>
      ) : (
        <button 
          className="chat-button"
          onClick={() => setShowChatWidget(true)}
        >
          <FaComments size={24} />
        </button>
      )}

      <style jsx>{`
        .search-input:focus {
          box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25) !important;
          border-color: #dc3545 !important;
        }

        .search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.375rem;
          margin-top: 0.5rem;
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
        }

        .search-result-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .search-result-item:hover {
          background: rgba(220, 53, 69, 0.1);
        }

        .category-card {
          transition: all 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(220, 53, 69, 0.2);
        }

        .topic-link {
          transition: all 0.3s ease;
        }

        .topic-link:hover {
          color: #dc3545 !important;
          transform: translateX(5px);
        }

        .video-thumbnail {
          position: relative;
          border-radius: 0.375rem;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .video-card {
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .video-card:hover {
          transform: translateY(-5px);
        }

        .video-card:hover .video-overlay {
          opacity: 1;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .play-button {
          width: 60px;
          height: 60px;
          background: rgba(220, 53, 69, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .video-card:hover .play-button {
          transform: scale(1.1);
          background: rgba(220, 53, 69, 1);
        }

        .duration {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          background: rgba(0,0,0,0.75);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }

        .video-info {
          padding: 0 0.5rem;
        }

        .question-card {
          transition: all 0.3s ease;
        }

        .question-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(220, 53, 69, 0.2);
        }

        .contact-btn {
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }

        .contact-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(220, 53, 69, 0.4);
        }

        .faq-btn:hover {
          background-color: rgba(255,255,255,0.1);
        }

        .chat-button {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 60px;
          height: 60px;
          border-radius: 30px;
          background: #dc3545;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
          z-index: 1000;
        }

        .chat-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(220, 53, 69, 0.4);
        }

        .chat-widget {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 350px;
          height: 450px;
          background: #1a1a1a;
          border-radius: 1rem;
          box-shadow: 0 5px 20px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          z-index: 1000;
        }

        .chat-header {
          padding: 1rem;
          background: #dc3545;
          color: white;
          border-radius: 1rem 1rem 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-body {
          flex-grow: 1;
          padding: 1rem;
          overflow-y: auto;
        }

        .chat-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .chat-message {
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          margin-bottom: 0.5rem;
          max-width: 80%;
        }

        .chat-message.support {
          background: rgba(220, 53, 69, 0.1);
          margin-right: auto;
        }
      `}</style>
    </div>
  )
}

export default HelpCenter 