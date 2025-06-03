import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

function Home() {
  const [showDemo, setShowDemo] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const heroTexts = [
    "Transform Your Future",
    "Master New Skills",
    "Join Global Community"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: 'bi-people', label: 'Active Learners', value: '50K+' },
    { icon: 'bi-book', label: 'Total Courses', value: '300+' },
    { icon: 'bi-star', label: 'Expert Instructors', value: '100+' },
  ];

  const categories = [
    {
      icon: 'bi-code-square',
      title: 'Web Development',
      description: 'Learn frontend and backend development',
      courses: 45,
      color: 'primary'
    },
    {
      icon: 'bi-database',
      title: 'Data Science',
      description: 'Master data analysis and machine learning',
      courses: 32,
      color: 'success'
    },
    {
      icon: 'bi-palette',
      title: 'UI/UX Design',
      description: 'Create beautiful user interfaces',
      courses: 28,
      color: 'info'
    },
    {
      icon: 'bi-graph-up',
      title: 'Business Analytics',
      description: 'Drive business decisions with data',
      courses: 25,
      color: 'warning'
    },
    {
      icon: 'bi-globe',
      title: 'Digital Marketing',
      description: 'Master modern marketing strategies',
      courses: 30,
      color: 'danger'
    },
    {
      icon: 'bi-shield',
      title: 'Cyber Security',
      description: 'Protect systems and networks',
      courses: 22,
      color: 'secondary'
    },
    {
      icon: 'bi-cpu',
      title: 'AI & Machine Learning',
      description: 'Build intelligent applications',
      courses: 35,
      color: 'dark'
    },
    {
      icon: 'bi-cloud',
      title: 'Cloud Computing',
      description: 'Master cloud technologies',
      courses: 27,
      color: 'primary'
    }
  ];

  const features = [
    {
      icon: 'bi-book',
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with years of experience in their fields.'
    },
    {
      icon: 'bi-people',
      title: 'Interactive Learning',
      description: 'Engage with peers and instructors in real-time collaborative sessions.'
    },
    {
      icon: 'bi-trophy',
      title: 'Certification',
      description: 'Earn recognized certificates upon completion of your courses.'
    },
    {
      icon: 'bi-bullseye',
      title: 'Personalized Path',
      description: 'Follow a customized learning path tailored to your goals and pace.'
    },
    {
      icon: 'bi-lightbulb',
      title: 'Practical Projects',
      description: 'Apply your knowledge through hands-on projects and real-world scenarios.'
    },
    {
      icon: 'bi-rocket',
      title: 'Career Growth',
      description: 'Access career support, mentorship, and job placement assistance.'
    },
    {
      icon: 'bi-clock',
      title: 'Flexible Schedule',
      description: 'Learn at your own pace with 24/7 access to course materials.'
    },
    {
      icon: 'bi-shield',
      title: 'Quality Content',
      description: 'Access regularly updated, industry-relevant curriculum.'
    }
  ];

  const courses = [
    {
      id: 1,
      title: 'Complete React Developer Course',
      description: 'Master React 18 with Redux, Hooks, and all the modern tools and best practices used by top companies.',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      instructor: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
        role: 'Senior Developer'
      },
      rating: 4.9,
      students: 15000,
      duration: '22h 30m',
      level: 'Intermediate',
      price: '$89.99'
    },
    {
      id: 2,
      title: 'UI/UX Design Masterclass',
      description: 'Learn UI/UX design from scratch with industry best practices and modern tools.',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      instructor: {
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
        role: 'Design Lead'
      },
      rating: 4.8,
      students: 12000,
      duration: '18h 45m',
      level: 'Beginner',
      price: '$79.99'
    },
    {
      id: 3,
      title: 'Advanced JavaScript Programming',
      description: 'Take your JavaScript skills to the next level with advanced concepts and patterns.',
      image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      instructor: {
        name: 'David Wilson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
        role: 'Senior Developer'
      },
      rating: 4.7,
      students: 8000,
      duration: '25h',
      level: 'Advanced',
      price: '$94.99'
    }
  ];

  const partners = [
    { 
      name: 'Google', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg'
    },
    { 
      name: 'Microsoft', 
      logo: 'https://www.microsoft.com/favicon.ico'
    },
    { 
      name: 'Amazon', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg'
    },
    { 
      name: 'Apple', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg'
    },
    { 
      name: 'Meta', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png'
    },
    { 
      name: 'Netflix', 
      logo: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/227_Netflix_logo-512.png'
    }
  ];

  return (
    <div className="bg-dark">
      {/* Enhanced Hero Section */}
      <section className="hero-section position-relative overflow-hidden">
        {/* Video Background */}
        <div className="video-background">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            poster="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-programming-code-closeup-1107-large.mp4" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-programming-code-closeup-1107-large.webm" type="video/webm" />
          </video>
        </div>
        
        {/* Dark Overlay with Gradient */}
        <div className="video-overlay"></div>
        
        <div className="container position-relative z-index-2 py-7">
          <div className="row align-items-center min-vh-95">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="hero-content"
              >
                <motion.span 
                  className="badge bg-danger px-3 py-2 mb-4 rounded-pill d-inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Le Wagon Bootcamp
                </motion.span>
                
                <motion.h1 
                  className="hero-title display-3 fw-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-gradient">
                    {heroTexts[currentTextIndex]}
                  </span>
                  <span className="d-block mt-2">
                    Learn to code with experts
                  </span>
                </motion.h1>

                <motion.p 
                  className="lead mb-5 text-light-gray"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Join our intensive coding bootcamp and learn from industry experts. 
                  Build real projects, gain practical skills, and launch your tech career.
                </motion.p>

                <motion.div 
                  className="hero-cta d-flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link 
                    to="/courses" 
                    className="btn btn-gradient-primary btn-lg rounded-pill px-5 py-3"
                  >
                    Start Learning
                    <i className="bi bi-arrow-right ms-2"></i>
                  </Link>
                  
                  <button 
                    className="btn btn-outline-light btn-lg rounded-pill px-5 py-3"
                    onClick={() => setShowDemo(true)}
                  >
                    <i className="bi bi-play-circle me-2"></i>
                    Watch Demo
                  </button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div 
                  className="hero-trust-indicators mt-5 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="row g-4">
                    <div className="col-6 col-md-4">
                      <div className="d-flex align-items-center">
                        <div className="icon-box me-3">
                          <i className="bi bi-people students-icon"></i>
                        </div>
                        <div>
                          <h4 className="h6 mb-1">50K+ Students</h4>
                          <p className="small mb-0">Worldwide</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-4">
                      <div className="d-flex align-items-center">
                        <div className="icon-box me-3">
                          <i className="bi bi-star rating-icon"></i>
                        </div>
                        <div>
                          <h4 className="h6 mb-1">4.9/5 Rating</h4>
                          <p className="small mb-0">By Students</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-4">
                      <div className="d-flex align-items-center">
                        <div className="icon-box me-3">
                          <i className="bi bi-briefcase success-icon"></i>
                        </div>
                        <div>
                          <h4 className="h6 mb-1">93% Success</h4>
                          <p className="small mb-0">Job Placement</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <div className="col-lg-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="hero-image-wrapper position-relative"
              >
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="floating-card p-3 position-absolute top-0 end-0"
                >
                  <div className="d-flex align-items-center">
                    <img 
                      src="https://randomuser.me/api/portraits/women/1.jpg" 
                      alt="" 
                      className="rounded-circle me-3" 
                      width="48" 
                      height="48" 
                    />
                    <div>
                      <p className="text-dark mb-0 fw-medium">New Achievement!</p>
                      <small className="text-muted">Completed React Course</small>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="floating-stats p-3 position-absolute bottom-0 start-0"
                >
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <div className="chart-circle"></div>
                    </div>
                    <div>
                      <h4 className="h6 mb-1 text-dark">Learning Progress</h4>
                      <p className="small text-primary mb-0">+64% this week</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Tech Stack Logos */}
        <div className="tech-stack-wrapper position-absolute bottom-0 start-0 w-100">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 col-lg-3 mb-3 mb-lg-0">
                <p className="text-light-gray mb-0 text-center text-lg-start fw-medium">
                  Technologies you'll master:
                </p>
              </div>
              <div className="col-12 col-lg-9">
                <div className="tech-logos d-flex justify-content-center justify-content-lg-between align-items-center gap-4">
                  <motion.img 
                    whileHover={{ scale: 1.1, y: -5 }}
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" 
                    alt="React"
                    className="react-logo"
                  />
                  <motion.img 
                    whileHover={{ scale: 1.1, y: -5 }}
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" 
                    alt="Vue"
                    className="vue-logo"
                  />
                  <motion.img 
                    whileHover={{ scale: 1.1, y: -5 }}
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" 
                    alt="Angular"
                    className="angular-logo"
                  />
                  <motion.img 
                    whileHover={{ scale: 1.1, y: -5 }}
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" 
                    alt="Node.js"
                    className="node-logo"
                  />
                  <motion.img 
                    whileHover={{ scale: 1.1, y: -5 }}
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" 
                    alt="Python"
                    className="python-logo"
                  />
                  <motion.img 
                    whileHover={{ scale: 1.1, y: -5 }}
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg" 
                    alt="Ruby"
                    className="ruby-logo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Our Course Categories
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Explore Our Popular Categories
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Choose from a wide range of courses designed to help you master the skills you need for your career
            </motion.p>
          </div>

          <div className="row g-4">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                className="col-md-6 col-lg-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`category-card category-${category.title.toLowerCase().replace(/\s+/g, '')}`}>
                  <div className="category-icon">
                    <i className={`bi ${category.icon}`}></i>
                  </div>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <div className="category-stats">
                    <div className="courses-count">
                      <i className="bi bi-play-circle"></i>
                      <span>{category.courses} Courses</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-title">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Why Choose Us
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              What Makes Us Different
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Discover why thousands of students choose our platform for their learning journey
            </motion.p>
          </div>

          <div className="row g-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="col-md-6 col-lg-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`feature-card feature-${feature.title.toLowerCase().replace(/\s+/g, '')}`}>
                  <div className="feature-icon">
                    <i className={`bi ${feature.icon}`}></i>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="popular-courses">
        <div className="container">
          <div className="courses-header">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Featured Courses
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Most Popular Courses
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Start your learning journey with our top-rated courses
            </motion.p>
          </div>

          <div className="row g-4">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                className="col-md-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="course-card">
                  <div className="course-image-wrapper">
                    <img src={course.image} alt={course.title} className="course-image" />
                    <div className="course-price-tag">{course.price}</div>
                  </div>
                  <div className="course-content">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                    
                    <div className="instructor-info">
                      <img 
                        src={course.instructor.avatar} 
                        alt={course.instructor.name} 
                        className="instructor-avatar"
                      />
                      <div className="instructor-details">
                        <h4>{course.instructor.name}</h4>
                        <p>{course.instructor.role}</p>
                      </div>
                    </div>

                    <div className="course-stats">
                      <div className="stat-item">
                        <div className="stat-value">
                          <i className="bi bi-star-fill"></i>
                          {course.rating}
                        </div>
                        <div className="stat-label">Rating</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">
                          <i className="bi bi-people"></i>
                          {(course.students / 1000).toFixed(1)}k
                        </div>
                        <div className="stat-label">Students</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">
                          <i className="bi bi-clock"></i>
                          {course.duration}
                        </div>
                        <div className="stat-label">Duration</div>
                      </div>
                    </div>

                    <div className="course-action">
                      <button className="btn-learn-more">
                        Learn More
                        <i className="bi bi-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="view-all-courses">
            <motion.button
              className="btn-view-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Courses
              <i className="bi bi-arrow-right ms-2"></i>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <div className="container">
          <div className="partners-header">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Our Partners
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Trusted by Industry Leaders
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              We collaborate with leading companies to provide you with the best learning experience and career opportunities
            </motion.p>
          </div>

          <div className="row g-4">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                className="col-6 col-md-4 col-lg-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="partner-card">
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="partner-logo" 
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="partner-stats">
            <div className="row g-4">
              <motion.div
                className="col-md-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="stat-card">
                  <i className="bi bi-building stat-icon"></i>
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Partner Companies</div>
                </div>
              </motion.div>
              <motion.div
                className="col-md-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="stat-card">
                  <i className="bi bi-person-workspace stat-icon"></i>
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Job Opportunities</div>
                </div>
              </motion.div>
              <motion.div
                className="col-md-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="stat-card">
                  <i className="bi bi-globe stat-icon"></i>
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Countries</div>
                </div>
              </motion.div>
              <motion.div
                className="col-md-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="stat-card">
                  <i className="bi bi-graph-up-arrow stat-icon"></i>
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="display-4">What Our Students Say</h2>
            <p className="lead">Real success stories from our graduates who transformed their careers through our programs</p>
          </div>
          
          <div className="row g-4">
            {/* Testimonial 1 */}
            <motion.div 
              className="col-lg-4 col-md-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <img
                      src="https://randomuser.me/api/portraits/women/1.jpg"
                      alt="Sarah Johnson"
                      className="rounded-circle me-3"
                      width="64"
                      height="64"
                    />
                    <div>
                      <h6 className="text-white mb-0">Sarah Johnson</h6>
                      <p className="text-gray-400 mb-0">Full Stack Developer at Google</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    "The comprehensive curriculum and hands-on projects at Le Wagon completely transformed my career. I went from a marketing background to landing my dream job as a developer at Google. The instructors were exceptional and the community support was invaluable."
                  </p>
                  <div className="testimonial-rating">
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                  </div>
                  <div className="testimonial-company">
                    <div className="d-flex align-items-center">
                      <img 
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MiIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDcyIDI0Ij48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTcuNDMgMi4xNWMzLjgyIDAgNi45NyAyLjkzIDYuOTcgNi41NCAwIDIuNi0xLjMgNC44My0zLjM3IDUuOThsNS41NyA4LjE4aC0zLjlsLTUuMDItNy42N2gtMi4wOHY3LjY3aC0zLjI4VjIuMTVoNS4xMXptLTEuODMgMi43N3Y3LjUyaDEuODNjMi4wNyAwIDMuNjgtMS42NyAzLjY4LTMuNzYgMC0yLjEtMS42MS0zLjc2LTMuNjgtMy43NmgtMS44M3ptMTYuODUgMTcuOTNWMi4xNWgxMS4xOHYyLjc3aC03Ljl2NS4zM2g3LjA4djIuNzdoLTcuMDh2Ny4wNmg3Ljl2Mi43N0gzMi40NXptMTkuMjUgMGwtNi4xNC04LjM1LTEuMjMgMS40NHY2LjkxaC0zLjI4VjIuMTVoMy4yOHY4LjI2bDYuODctOC4yNmgzLjk3bC03LjE3IDguNDQgNy43IDExLjQ5aC00WiIvPjwvc3ZnPg==" 
                        alt="Google" 
                        style={{ filter: 'brightness(0) invert(1)', width: '80px', height: 'auto' }}
                      />
                      <span className="text-gray-400 ms-2">Verified Graduate</span>
                    </div>
                    <div className="testimonial-date">
                      <i className="far fa-calendar-alt"></i>
                      <span>2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div 
              className="col-lg-4 col-md-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <img
                      src="https://randomuser.me/api/portraits/men/2.jpg"
                      alt="David Chen"
                      className="rounded-circle me-3"
                      width="64"
                      height="64"
                    />
                    <div>
                      <h6 className="text-white mb-0">David Chen</h6>
                      <p className="text-gray-400 mb-0">Software Engineer at Microsoft</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    "Le Wagon's bootcamp exceeded all my expectations. The project-based learning approach gave me real-world experience, and the career support helped me land multiple job offers. I'm now working on exciting projects at Microsoft."
                  </p>
                  <div className="testimonial-rating">
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                  </div>
                  <div className="testimonial-company">
                    <div className="d-flex align-items-center">
                      <img 
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTEuNCAwaDQuNnY0LjZoLTQuNlYwem0wIDYuOWg0LjZ2NC42aC00LjZWNi45em02LjkgMGg0LjZ2NC42aC00LjZWNi45em0tMTMuOCA2LjloNC42djQuNkg0LjV2LTQuNnptNi45IDBoNC42djQuNmgtNC42di00LjZ6bTYuOSAwaDQuNnY0LjZoLTQuNnYtNC42eiIvPjwvc3ZnPg==" 
                        alt="Microsoft" 
                        style={{ filter: 'brightness(0) invert(1)', width: '32px', height: 'auto' }}
                      />
                      <span className="text-gray-400 ms-2">Verified Graduate</span>
                    </div>
                    <div className="testimonial-date">
                      <i className="far fa-calendar-alt"></i>
                      <span>2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div 
              className="col-lg-4 col-md-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <img
                      src="https://randomuser.me/api/portraits/women/3.jpg"
                      alt="Emma Rodriguez"
                      className="rounded-circle me-3"
                      width="64"
                      height="64"
                    />
                    <div>
                      <h6 className="text-white mb-0">Emma Rodriguez</h6>
                      <p className="text-gray-400 mb-0">Frontend Developer at Amazon</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    "The supportive environment and practical curriculum at Le Wagon gave me the confidence to switch careers. The emphasis on modern technologies and best practices prepared me well for my role at Amazon. It was an incredible journey!"
                  </p>
                  <div className="testimonial-rating">
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                  </div>
                  <div className="testimonial-company">
                    <div className="d-flex align-items-center">
                      <img 
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTQuMTggMTMuMDhsLTIuNTEtMS4xNS0yLjUgMS4xNWEuODUuODUgMCAwIDEtMS4xLS40LjgzLjgzIDAgMCAxIC4zOC0xLjEybDIuNTEtMS4xNVY4LjI4YS44NS44NSAwIDAgMSAxLjctMHYyLjEzbDIuNSAxLjE1Yy40LjE4LjU3LjY1LjM5IDEuMDVhLjg1Ljg1IDAgMCAxLTEuMTEuNHptNy4zMi0uMjNhMTIuMDQgMTIuMDQgMCAwIDEtMTkgMCAxLjggMS44IDAgMCAxIDAtMi41NyAxMi4wNCAxMi4wNCAwIDAgMSAxOSAwIDEuOCAxLjggMCAwIDEgMCAyLjU3eiIvPjwvc3ZnPg==" 
                        alt="Amazon" 
                        style={{ filter: 'brightness(0) invert(1)', width: '32px', height: 'auto' }}
                      />
                      <span className="text-gray-400 ms-2">Verified Graduate</span>
                    </div>
                    <div className="testimonial-date">
                      <i className="far fa-calendar-alt"></i>
                      <span>2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter py-5 position-relative overflow-hidden" 
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.3)'
        }}>
        {/* Decorative Elements */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ opacity: '0.05' }}>
          <div className="position-absolute" style={{ 
            width: '300px', 
            height: '300px', 
            background: 'radial-gradient(circle, #dc3545 0%, rgba(220, 53, 69, 0) 70%)',
            top: '-150px',
            left: '-150px'
          }}></div>
          <div className="position-absolute" style={{ 
            width: '200px', 
            height: '200px', 
            background: 'radial-gradient(circle, #dc3545 0%, rgba(220, 53, 69, 0) 70%)',
            bottom: '-100px',
            right: '-100px'
          }}></div>
        </div>

        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <div className="newsletter-badge mb-4">
                <span className="badge bg-danger px-4 py-2 rounded-pill fs-6 shadow-sm">
                  <i className="bi bi-envelope-paper-heart me-2"></i>
                  Newsletter
                </span>
              </div>
              
              <h2 className="display-4 fw-bold mb-4 text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                Stay Updated
              </h2>
              
              <p className="lead mb-5 text-white" style={{ opacity: '0.9' }}>
                Join our community and get the latest updates about courses, tech trends, and special offers
              </p>
              
              <div className="newsletter-form">
                <div className="input-group input-group-lg mb-4 shadow-lg">
                  <input 
                    type="email" 
                    className="form-control border-0 ps-4" 
                    placeholder="Enter your email address"
                    style={{ 
                      height: '65px',
                      fontSize: '1.1rem',
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      color: '#495057'
                    }}
                  />
                  <button 
                    className="btn btn-danger btn-lg px-5 d-flex align-items-center fw-bold"
                    style={{ 
                      height: '65px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateX(5px)';
                      e.target.style.backgroundColor = '#c82333';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateX(0)';
                      e.target.style.backgroundColor = '#dc3545';
                    }}
                  >
                    Subscribe
                    <i className="bi bi-arrow-right-circle-fill ms-2 fs-5"></i>
                  </button>
                </div>
                
                <div className="newsletter-features row mt-5">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded-pill py-2 px-3">
                      <i className="bi bi-shield-check text-danger me-2 fs-5"></i>
                      <span className="text-white">No Spam</span>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded-pill py-2 px-3">
                      <i className="bi bi-clock text-danger me-2 fs-5"></i>
                      <span className="text-white">Weekly Updates</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded-pill py-2 px-3">
                      <i className="bi bi-envelope text-danger me-2 fs-5"></i>
                      <span className="text-white">Cancel Anytime</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <small className="text-white-50">
                    By subscribing, you agree to our Privacy Policy and Terms of Service
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showDemo && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-gray-800 border border-gray-700">
              <div className="modal-header border-gray-700">
                <h5 className="modal-title text-white">Watch Demo</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowDemo(false)}
                ></button>
              </div>
              <div className="modal-body p-0">
                <div className="ratio ratio-16x9">
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/R9GojtfFBHU?si=QETWrujxRuaHVcaf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home 