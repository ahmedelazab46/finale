import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { 
  FaHandshake, FaUserShield, FaFileContract, FaBalanceScale, 
  FaBan, FaExclamationTriangle, FaCheck, FaArrowRight 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const sections = [
    {
      icon: <FaHandshake />,
      title: "User Agreement",
      content: `By accessing our services, you agree to:
        • Follow our community guidelines
        • Provide accurate information
        • Maintain account security
        • Use the platform responsibly
        • Respect intellectual property`,
      highlights: [
        "Platform rules",
        "User responsibilities",
        "Account security"
      ]
    },
    {
      icon: <FaUserShield />,
      title: "User Rights & Responsibilities",
      content: `As a user, you have the right to:
        • Access course materials
        • Receive technical support
        • Request account changes
        • Submit feedback
        • Cancel subscription`,
      highlights: [
        "Access rights",
        "Support services",
        "Cancellation terms"
      ]
    },
    {
      icon: <FaFileContract />,
      title: "Course Enrollment",
      content: `Course enrollment terms:
        • Payment requirements
        • Refund eligibility
        • Access duration
        • Content usage limits
        • Transfer restrictions`,
      highlights: [
        "Payment terms",
        "Refund policy",
        "Access rules"
      ]
    },
    {
      icon: <FaBalanceScale />,
      title: "Intellectual Property",
      content: `Content protection rules:
        • Copyright compliance
        • Usage restrictions
        • Sharing limitations
        • Attribution requirements
        • License terms`,
      highlights: [
        "Copyright rules",
        "Usage rights",
        "Sharing policy"
      ]
    },
    {
      icon: <FaBan />,
      title: "Prohibited Activities",
      content: `The following are not allowed:
        • Account sharing
        • Content redistribution
        • Unauthorized access
        • Disruptive behavior
        • Commercial use`,
      highlights: [
        "Usage restrictions",
        "Content rules",
        "Behavior guidelines"
      ]
    },
    {
      icon: <FaExclamationTriangle />,
      title: "Termination Clauses",
      content: `Account termination may occur for:
        • Terms violation
        • Payment default
        • Misuse of platform
        • Legal requirements
        • Policy breaches`,
      highlights: [
        "Violation consequences",
        "Account suspension",
        "Appeal process"
      ]
    }
  ];

  const lastUpdated = "May 31, 2025";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="bg-dark text-white min-vh-100">
      {/* Hero Section */}
      <motion.div 
        className="position-relative py-5" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          backgroundColor: '#111111',
          backgroundImage: 'url(https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.9) 0%, rgba(0,0,0,0.95) 100%)',
          zIndex: 1
        }}></div>
        
        <Container className="position-relative" style={{ zIndex: 2 }}>
          <Row className="py-5 text-center">
            <Col>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="display-3 fw-bold mb-4">Terms of Service</h1>
                <p className="lead mb-4" style={{ opacity: 0.9 }}>
                  Please read these terms carefully before using our platform.
                </p>
                <p className="text-danger mb-0">Last Updated: {lastUpdated}</p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </motion.div>

      {/* Main Content */}
      <div className="py-5" style={{ backgroundColor: '#1A1A1A' }}>
        <Container>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Row className="g-4 row-equal-height">
              {sections.map((section, index) => (
                <Col key={index} md={6} lg={4} className="d-flex">
                  <motion.div variants={itemVariants} className="w-100">
                    <Card 
                      className={`h-100 bg-dark border-danger privacy-card ${activeSection === index ? 'active' : ''}`}
                      onMouseEnter={() => setActiveSection(index)}
                      onMouseLeave={() => setActiveSection(null)}
                    >
                      <Card.Body className="d-flex flex-column">
                        <div className="card-header-custom d-flex align-items-center mb-4">
                          <div className="icon-wrapper text-danger me-3">
                            {section.icon}
                          </div>
                          <h3 className="h4 mb-0 text-white">{section.title}</h3>
                        </div>
                        <div className="card-content flex-grow-1">
                          <div className="text-light mb-4" style={{ 
                            whiteSpace: 'pre-line',
                            opacity: 0.9,
                            fontSize: '0.95rem',
                            lineHeight: '1.6'
                          }}>
                            {section.content}
                          </div>
                          <div className="highlights mt-3 pt-3 border-top border-danger border-opacity-25">
                            {section.highlights.map((highlight, idx) => (
                              <div key={idx} className="d-flex align-items-center mb-2 highlight-item">
                                <FaCheck className="text-danger me-2" />
                                <span className="text-white" style={{ fontSize: '0.9rem' }}>{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </div>

      {/* Contact Section */}
      <motion.div 
        className="py-5" 
        style={{ backgroundColor: '#111111' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h2 className="h3 mb-4">Questions About Our Terms?</h2>
              <p className="text-white-50 mb-4">
                If you have any questions about our terms of service, please contact our support team.
              </p>
              <motion.button 
                className="btn btn-danger btn-lg px-5 py-3 rounded-pill d-inline-flex align-items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Support
                <FaArrowRight className="ms-2" />
              </motion.button>
            </Col>
          </Row>
        </Container>
      </motion.div>

      <style jsx>{`
        .row-equal-height {
          display: flex;
          flex-wrap: wrap;
        }

        .row-equal-height > [class*='col-'] {
          display: flex;
          flex-direction: column;
        }

        .privacy-card {
          transition: all 0.3s ease;
          cursor: pointer;
          border-width: 1px;
          background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .card-header-custom {
          min-height: 60px;
        }

        .icon-wrapper {
          font-size: 2.5rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(220, 53, 69, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .privacy-card:hover .icon-wrapper {
          transform: scale(1.1);
          background: rgba(220, 53, 69, 0.2);
        }

        .card-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .privacy-card:hover, .privacy-card.active {
          transform: translateY(-10px);
          border-color: #dc3545;
          box-shadow: 0 10px 30px rgba(220, 53, 69, 0.2);
          background: linear-gradient(145deg, #1d1d1d, #2d2d2d);
        }

        .privacy-card .highlights {
          opacity: 0.9;
          transition: all 0.3s ease;
        }

        .privacy-card:hover .highlights {
          opacity: 1;
        }

        .highlight-item {
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .privacy-card:hover .highlight-item:hover {
          background: rgba(220, 53, 69, 0.1);
        }

        .btn-danger {
          box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
          transition: all 0.3s ease;
          background: linear-gradient(45deg, #dc3545, #e83e4d);
          border: none;
        }

        .btn-danger:hover {
          box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
          background: linear-gradient(45deg, #e83e4d, #dc3545);
        }

        .text-danger {
          color: #ff4d5e !important;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .privacy-card .text-danger {
          animation: float 3s ease-in-out infinite;
        }

        /* Custom scrollbar */
        .privacy-card .card-body {
          scrollbar-width: thin;
          scrollbar-color: #dc3545 #2a2a2a;
        }

        .privacy-card .card-body::-webkit-scrollbar {
          width: 8px;
        }

        .privacy-card .card-body::-webkit-scrollbar-track {
          background: #2a2a2a;
          border-radius: 4px;
        }

        .privacy-card .card-body::-webkit-scrollbar-thumb {
          background-color: #dc3545;
          border-radius: 4px;
        }

        @media (min-width: 768px) {
          .row-equal-height {
            margin-left: -15px;
            margin-right: -15px;
          }
          
          .row-equal-height > [class*='col-'] {
            padding-left: 15px;
            padding-right: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default TermsOfService; 