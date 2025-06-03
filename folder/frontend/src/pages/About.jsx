import React, { useEffect } from 'react'
import { Container, Row, Col, Button, Card } from 'react-bootstrap'
import { FaGraduationCap, FaGlobe, FaUsers, FaLaptopCode, FaChartLine, FaStar } from 'react-icons/fa'
import AOS from 'aos'
import 'aos/dist/aos.css'

function About() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    })
  }, [])

  return (
    <div className="bg-dark text-white">
      {/* Hero Section */}
      <div className="py-5" style={{ backgroundColor: '#111111' }}>
        <Container>
          <Row className="align-items-center py-5">
            <Col lg={6} className="mb-4 mb-lg-0" data-aos="fade-right">
              <h1 className="display-4 fw-bold mb-4">
                We are <span className="text-danger">Le Wagon</span>
              </h1>
              <p className="lead mb-4" style={{ opacity: 0.8 }}>
                Le Wagon is a world-leading coding bootcamp that brings technical skills to creative people. Our mission is to empower the next generation of tech innovators and entrepreneurs.
              </p>
              <Button 
                variant="danger" 
                size="lg" 
                className="px-4 btn-hover-effect"
                href="/courses"
              >
                Discover Our Courses
              </Button>
            </Col>
            <Col lg={6} data-aos="fade-left">
              <div className="position-relative">
                <img 
                  src="/images/hero-coding.jpg"
                  alt="Students coding at Le Wagon" 
                  className="img-fluid rounded shadow-lg floating-animation"
                  style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 gradient-overlay rounded"></div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Stats Section */}
      <div className="py-4" style={{ backgroundColor: '#1A1A1A' }}>
        <Container>
          <Row className="text-center g-4">
            {[
              { number: '15,000+', label: 'Alumni Worldwide' },
              { number: '45+', label: 'Global Campuses' },
              { number: '95%', label: 'Employment Rate' },
              { number: '#1', label: 'Coding Bootcamp' }
            ].map((stat, index) => (
              <Col md={3} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="stat-card p-4">
                  <h2 className="display-5 fw-bold text-danger mb-2">{stat.number}</h2>
                  <p className="mb-0" style={{ opacity: 0.8 }}>{stat.label}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Mission Section with Background Image */}
      <div className="py-5 position-relative">
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{
            backgroundImage: 'url(/images/mission-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1
          }}
        ></div>
        <Container className="position-relative">
          <Row className="text-center mb-5">
            <Col data-aos="fade-up">
              <h2 className="display-5 fw-bold mb-4">Our Mission</h2>
              <p className="lead" style={{ opacity: 0.8, maxWidth: '800px', margin: '0 auto' }}>
                We believe that coding skills are the key to unlocking endless possibilities in today's digital world. Our goal is to make these skills accessible to everyone, everywhere.
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {[
              {
                icon: <FaGraduationCap size={48} />,
                title: 'Education',
                description: 'Intensive coding bootcamps that teach practical skills for the real world.',
                image: '/images/education.jpg'
              },
              {
                icon: <FaGlobe size={48} />,
                title: 'Global Community',
                description: 'Join a network of 15,000+ alumni across 45 cities worldwide.',
                image: '/images/community.jpg'
              },
              {
                icon: <FaUsers size={48} />,
                title: 'Career Support',
                description: 'We help our graduates find jobs and start their tech careers.',
                image: '/images/career.jpg'
              }
            ].map((feature, index) => (
              <Col md={4} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="feature-card p-4 text-center h-100">
                  <div className="mb-4">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="img-fluid rounded mb-3"
                      style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="text-danger mb-3">{feature.icon}</div>
                  <h3 className="h4 mb-3">{feature.title}</h3>
                  <p style={{ opacity: 0.8 }}>{feature.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Bootcamp Section */}
      <div className="py-5" style={{ backgroundColor: '#111111' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0" data-aos="fade-right">
              <div className="position-relative">
                <img 
                  src="/images/bootcamp-class.jpg"
                  alt="Le Wagon Bootcamp Class" 
                  className="img-fluid rounded shadow-lg"
                  style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                />
              </div>
            </Col>
            <Col lg={6} data-aos="fade-left">
              <h2 className="display-5 fw-bold mb-4">Our Bootcamp</h2>
              <p className="lead mb-4" style={{ opacity: 0.8 }}>
                Transform your career with our intensive 9-week bootcamp. You'll learn from industry experts, build real projects, and join a community of passionate developers.
              </p>
              <Row className="g-4">
                <Col md={6}>
                  <div className="feature-card p-3">
                    <div className="d-flex align-items-center">
                      <FaLaptopCode size={24} className="text-danger me-3" />
                      <div>
                        <h4 className="h5 mb-2">Web Development</h4>
                        <p className="mb-0" style={{ opacity: 0.8 }}>Master modern web technologies</p>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="feature-card p-3">
                    <div className="d-flex align-items-center">
                      <FaChartLine size={24} className="text-danger me-3" />
                      <div>
                        <h4 className="h5 mb-2">Career Growth</h4>
                        <p className="mb-0" style={{ opacity: 0.8 }}>Land your dream tech job</p>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Testimonials Section */}
      <div className="py-5" style={{ backgroundColor: '#1A1A1A' }}>
        <Container>
          <Row className="text-center mb-5">
            <Col data-aos="fade-up">
              <h2 className="display-5 fw-bold mb-4">Student Success Stories</h2>
              <p className="lead" style={{ opacity: 0.8, maxWidth: '800px', margin: '0 auto' }}>
                Hear from our alumni about their journey at Le Wagon
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Full-Stack Developer',
                company: 'Google',
                image: '/images/testimonial1.jpg',
                quote: "Le Wagon completely changed my career path. I went from marketing to tech, and I couldn't be happier!"
              },
              {
                name: 'Michael Chen',
                role: 'Frontend Developer',
                company: 'Facebook',
                image: '/images/testimonial2.jpg',
                quote: "The practical approach and supportive community made learning to code an amazing experience."
              },
              {
                name: 'Emma Davis',
                role: 'Tech Entrepreneur',
                company: 'TechStart',
                image: '/images/testimonial3.jpg',
                quote: "Thanks to Le Wagon, I was able to build my startup from scratch and secure funding."
              }
            ].map((testimonial, index) => (
              <Col md={4} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <Card className="testimonial-card bg-dark text-white h-100">
                  <Card.Body className="text-center p-4">
                    <div 
                      className="rounded-circle mb-3 mx-auto"
                      style={{ 
                        width: '120px',
                        height: '120px',
                        backgroundImage: `url(${testimonial.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '3px solid #dc3545'
                      }}
                    />
                    <div className="mb-3">
                      {[1,2,3,4,5].map(star => (
                        <FaStar key={star} className="text-danger mx-1" />
                      ))}
                    </div>
                    <p className="mb-4" style={{ opacity: 0.8 }}>"{testimonial.quote}"</p>
                    <h4 className="h5 mb-1">{testimonial.name}</h4>
                    <p className="small mb-1">{testimonial.role}</p>
                    <p className="small text-danger">{testimonial.company}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* CTA Section with Background Image */}
      <div className="py-5 position-relative">
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{
            backgroundImage: 'url(/images/cta-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1
          }}
        ></div>
        <Container className="position-relative">
          <Row className="text-center" data-aos="fade-up">
            <Col>
              <h2 className="display-5 fw-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="lead mb-4" style={{ opacity: 0.8 }}>
                Join our next batch and transform your career in tech.
              </p>
              <Button 
                variant="danger" 
                size="lg" 
                className="px-5 btn-hover-effect"
                href="/signup"
              >
                Apply Now
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx>{`
        .floating-animation {
          animation: floating 3s ease-in-out infinite;
        }

        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        .gradient-overlay {
          background: linear-gradient(45deg, rgba(220, 53, 69, 0.3), transparent);
          pointer-events: none;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          transition: transform 0.3s ease;
          overflow: hidden;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.08);
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          transition: transform 0.3s ease;
        }

        .testimonial-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
        }

        .btn-hover-effect {
          transition: transform 0.3s ease;
        }

        .btn-hover-effect:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}

export default About 