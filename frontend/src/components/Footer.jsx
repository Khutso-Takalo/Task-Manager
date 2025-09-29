// Footer Component
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-5 py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>
              <i className="fas fa-tasks me-2"></i>
              Task Manager
            </h5>
            <p className="mb-2">
              A comprehensive task management system for organizing and tracking your daily activities.
            </p>
            <p className="text-muted small">
              Streamline your workflow and boost productivity with our intuitive task management platform.
            </p>
          </div>
          
          <div className="col-md-3">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-light text-decoration-none">
                  <i className="fas fa-home me-2"></i>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/tasks" className="text-light text-decoration-none">
                  <i className="fas fa-list me-2"></i>
                  My Tasks
                </a>
              </li>
              <li>
                <a href="/profile" className="text-light text-decoration-none">
                  <i className="fas fa-user me-2"></i>
                  Profile
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-md-3">
            <h6>Support</h6>
            <ul className="list-unstyled">
              <li>
                <a href="#help" className="text-light text-decoration-none">
                  <i className="fas fa-question-circle me-2"></i>
                  Help Center
                </a>
              </li>
              <li>
                <a href="#contact" className="text-light text-decoration-none">
                  <i className="fas fa-envelope me-2"></i>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#feedback" className="text-light text-decoration-none">
                  <i className="fas fa-comment me-2"></i>
                  Send Feedback
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0 text-muted">
              © {currentYear} Task Manager. All rights reserved.
            </p>
          </div>
          
          <div className="col-md-6 text-md-end">
            <div className="social-links">
              <a href="#" className="text-light me-3" title="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-light me-3" title="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-light me-3" title="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-light" title="GitHub">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;