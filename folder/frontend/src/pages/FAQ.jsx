import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Accordion } from 'react-bootstrap';
import { FaChevronDown, FaGraduationCap, FaMoneyBillWave, FaCalendarAlt, FaLaptopCode } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

function FAQ() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const faqCategories = [
    {
      icon: <FaGraduationCap size={40} />,
      title: 'Educational Program',
      questions: [
        {
          q: 'What are the basic requirements to join the program?',
          a: 'Our program requires no prior programming experience. All you need is passion for learning and commitment to the intensive program.'
        },
        {
          q: 'How long is the program?',
          a: 'The program runs for 9 weeks full-time, with 8-10 hours daily of practical and theoretical training.'
        },
        {
          q: 'What skills will I learn?',
          a: 'You will learn HTML, CSS, JavaScript, React, Ruby on Rails, and more. We focus on the most in-demand skills in the job market.'
        }
      ]
    },
    {
      icon: <FaMoneyBillWave size={40} />,
      title: 'Fees & Payment',
      questions: [
        {
          q: 'How much does the program cost?',
          a: 'The cost varies by location and chosen program. We offer flexible payment options and convenient installment plans.'
        },
        {
          q: 'Are scholarships available?',
          a: 'Yes, we offer scholarships for outstanding students and special cases. You can apply for scholarships through a special form.'
        },
        {
          q: 'What is the refund policy?',
          a: 'We offer a full refund during the first week of the program if you decide not to continue.'
        }
      ]
    },
    {
      icon: <FaCalendarAlt size={40} />,
      title: 'Schedule',
      questions: [
        {
          q: 'When does the next batch start?',
          a: 'We have batches starting every month. You can check available dates on the application page.'
        },
        {
          q: 'Can I study part-time?',
          a: 'Yes, we offer a part-time program that extends over 24 weeks, suitable for working professionals and students.'
        },
        {
          q: 'What does a typical day look like?',
          a: 'The day starts at 9 AM and ends at 6 PM, with breaks, practical training, and review sessions.'
        }
      ]
    },
    {
      icon: <FaLaptopCode size={40} />,
      title: 'Employment & Future',
      questions: [
        {
          q: 'Do you help with job placement after graduation?',
          a: 'Yes, our specialized career team helps graduates find job opportunities and prepares them for resumes and interviews.'
        },
        {
          q: 'What is the employment rate for graduates?',
          a: '95% of our graduates find jobs in the tech industry within 6 months of graduation.'
        },
        {
          q: 'Which companies do you partner with?',
          a: 'We partner with major tech companies like Google and Facebook, as well as leading local and regional companies.'
        }
      ]
    }
  ];

  return (
    <div className="bg-dark text-white py-5">
      {/* Hero Section */}
      <div className="position-relative mb-5">
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{
            backgroundImage: 'url(/images/faq-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1
          }}
        ></div>
        <Container className="position-relative">
          <Row className="text-center py-5">
            <Col data-aos="fade-up">
              <h1 className="display-4 fw-bold mb-4">Frequently Asked Questions</h1>
              <p className="lead" style={{ opacity: 0.8 }}>
                Everything you need to know about Le Wagon's training program
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* FAQ Categories */}
      <Container>
        {faqCategories.map((category, index) => (
          <div key={index} className="mb-5" data-aos="fade-up">
            <div className="d-flex align-items-center mb-4">
              <div className="text-danger me-3">{category.icon}</div>
              <h2 className="h3 mb-0">{category.title}</h2>
            </div>
            <Accordion flush>
              {category.questions.map((item, qIndex) => (
                <Accordion.Item 
                  key={qIndex} 
                  eventKey={qIndex.toString()}
                  className="bg-transparent"
                >
                  <Accordion.Header className="faq-header">
                    <span className="text-white">{item.q}</span>
                  </Accordion.Header>
                  <Accordion.Body className="faq-body">
                    {item.a}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        ))}
      </Container>

      {/* Contact Section */}
      <Container className="mt-5">
        <Row className="justify-content-center text-center">
          <Col md={8} data-aos="fade-up">
            <Card className="bg-danger text-white p-5">
              <Card.Body>
                <h3 className="mb-4">Haven't Found Your Answer?</h3>
                <p className="mb-4">Our team is ready to answer all your questions</p>
                <button className="btn btn-outline-light btn-lg">Contact Us</button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .faq-header button {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: white !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 1rem !important;
          transition: all 0.3s ease !important;
        }

        .faq-header button:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }

        .faq-header button:not(.collapsed) {
          background-color: rgba(220, 53, 69, 0.1) !important;
        }

        .faq-body {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: rgba(255, 255, 255, 0.8) !important;
          border-radius: 0 0 8px 8px !important;
          padding: 1rem !important;
        }

        .accordion-button::after {
          filter: invert(1) !important;
        }

        .btn-outline-light:hover {
          background-color: white !important;
          color: #dc3545 !important;
        }
      `}</style>
    </div>
  );
}

export default FAQ; 