import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaYoutube,
  FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcApplePay, FaCcAmex
} from 'react-icons/fa'
import { BiMap, BiPhone, BiEnvelope } from 'react-icons/bi'
import './Footer.css'

function Footer() {
  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 }
  }

  const socialLinks = [
    { icon: FaFacebook, url: '#', color: '#1877f2' },
    { icon: FaTwitter, url: '#', color: '#1da1f2' },
    { icon: FaInstagram, url: '#', color: '#e4405f' },
    { icon: FaLinkedin, url: '#', color: '#0077b5' },
    { icon: FaGithub, url: '#', color: '#333' },
    { icon: FaYoutube, url: '#', color: '#ff0000' }
  ]

  const contactInfo = [
    { icon: BiMap, text: '123 Tech Street, Silicon Valley, CA' },
    { icon: BiPhone, text: '+1 (555) 123-4567' },
    { icon: BiEnvelope, text: 'contact@lewagon.com' }
  ]

  return (
    <footer className="footer-dark py-5">
      <div className="container">
        <div className="row g-4">
          {/* Company Info */}
          <motion.div 
            className="col-lg-4 mb-4 mb-lg-0"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="footer-brand mb-4">
              <img 
                src="https://avatars.githubusercontent.com/u/5470001"
                alt="Le Wagon" 
                height="40" 
                className="mb-3" 
              />
            </div>
            <p className="text-white-50 mb-4">
              Transform your future with Le Wagon's intensive coding bootcamp. Join our global community of developers and innovators.
            </p>
            <div className="social-links d-flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  className="social-link"
                  style={{ backgroundColor: social.color }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="col-lg-2 col-md-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h6 className="text-white fw-bold mb-4">Quick Links</h6>
            <ul className="footer-links list-unstyled">
              <li>
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li>
                <Link to="/courses" className="footer-link">Courses</Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">About</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">Contact</Link>
              </li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div 
            className="col-lg-2 col-md-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h6 className="text-white fw-bold mb-4">Support</h6>
            <ul className="footer-links list-unstyled">
              <li>
                <Link to="/faq" className="footer-link">FAQ</Link>
              </li>
              {/* Removing Help Center Link */}
              {/* <Link to="/help" className="footer-link">Help Center</Link> */}
              <li>
                <Link to="/terms" className="footer-link">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div 
            className="col-lg-4 col-md-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h6 className="text-white fw-bold mb-4">Stay Connected</h6>
            
            {/* Contact Info */}
            <div className="contact-info mb-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="d-flex align-items-center mb-3">
                  <div className="contact-icon">
                    <info.icon size={24} />
                  </div>
                  <span className="text-white-50 ms-3">{info.text}</span>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="newsletter">
              <h6 className="text-white fw-bold mb-3">Newsletter</h6>
              <p className="text-white-50 mb-3">
                Subscribe for updates and exclusive offers
              </p>
              <form className="newsletter-form">
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                  <motion.button 
                    type="submit" 
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subscribe
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>

        <motion.hr 
          className="footer-divider my-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        />

        {/* Bottom Bar */}
        <motion.div 
          className="row align-items-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="col-md-6 text-center text-md-start">
            <p className="copyright mb-0">
              © {new Date().getFullYear()} Le Wagon. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="payment-methods">
              <FaCcVisa size={32} className="payment-icon" />
              <FaCcMastercard size={32} className="payment-icon" />
              <FaCcPaypal size={32} className="payment-icon" />
              <FaCcApplePay size={32} className="payment-icon" />
              <FaCcAmex size={32} className="payment-icon" />
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer 