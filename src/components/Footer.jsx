import React from 'react';
import { Link } from 'react-router-dom';
import { FaInfoCircle, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaShieldAlt } from 'react-icons/fa';

const footerStyle = {
  backgroundColor: 'black',
  color: '#fff',
  padding: '1.5rem', // Decreased padding
  marginTop: '4rem', // Adjusted margin from the top
};

const containerStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
};

const sectionStyle = {
  marginBottom: '1rem', // Decreased margin bottom
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '0.5rem', // Decreased margin bottom
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
};

const iconStyle = {
  marginRight: '0.5rem',
};

const hrStyle = {
  borderTop: '1px solid #fff',
  margin: '1.5rem 0', // Added margin top and bottom
};

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={sectionStyle}>
          <h2 style={titleStyle}>Explore</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/" style={linkStyle}>
                <FaInfoCircle style={iconStyle} /> About
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/" style={linkStyle}>
                <FaEnvelope style={iconStyle} /> Contact
              </Link>
            </li>
            <li>
              <Link to="/" style={linkStyle}>
                <FaShieldAlt style={iconStyle} /> Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div style={sectionStyle}>
          <h2 style={titleStyle}>Follow Us</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={linkStyle}>
                <FaFacebook style={iconStyle} /> Facebook
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={linkStyle}>
                <FaTwitter style={iconStyle} /> Twitter
              </a>
            </li>
            <li>
              <a href="#" style={linkStyle}>
                <FaInstagram style={iconStyle} /> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <hr style={hrStyle} /> {/* Horizontal line */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem', height: '100px' }}> {/* Adjusted margin from the top and set height */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/images/tribesflix.png" alt="WebWonderz Logo" style={{ width: '100px', marginRight: '10px' }} /> {/* WebWonderz Logo */}
          <p>&copy; 2024 WebWonderz. All Rights Reserved.</p>
        </div>
        <p>Overall client rating is 4.8 out of 5.0 for Web Wonderz by 425+ Clients</p>
      </div>
    </footer>
  );
};

export default Footer;
