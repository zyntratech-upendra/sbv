import { NavLink } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

const Footer = () => {
  return (
    <>
      {/* ================= FOOTER ================= */}
      <footer className="school-footer">
        <div className="container py-5">
          <div className="row gy-4 align-items-start">

            {/* School Info */}
            <div className="col-lg-4 col-md-6">
              <h5 className="footer-title">SBV School</h5>
              <p className="footer-text">
                A modern school management system built to simplify administration,
                improve transparency, and enhance overall academic efficiency.
              </p>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6">
              <h6 className="footer-title">Quick Links</h6>
              <ul className="footer-links">
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
                <li><NavLink to="/contact">Contact</NavLink></li>
                <li><NavLink to="/login">Login</NavLink></li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="col-lg-3 col-md-6">
              <h6 className="footer-title">Contact</h6>

              <div className="contact-item">
                <MapPin size={16} />
                <span>Green Valley School, MG Road, Hyderabad</span>
              </div>

              <div className="contact-item">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </div>

              <div className="contact-item">
                <Mail size={16} />
                <span>info@schoolms.com</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="col-lg-3 col-md-6">
              <h6 className="footer-title">Follow Us</h6>

              <div className="social-links">
                <a href="#" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
                <a href="#" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href="#" aria-label="Twitter">
                  <Twitter size={18} />
                </a>
                <a href="#" aria-label="YouTube">
                  <Youtube size={18} />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom text-center py-3">
          <small>
            © {new Date().getFullYear()} SBV School. All Rights Reserved.
          </small>
        </div>
      </footer>

      {/* ================= INTERNAL CSS ================= */}
      <style>{`
        * {
          font-family: 'Inter', sans-serif;
        }

        .school-footer {
          background: linear-gradient(135deg, #535434, #666748);
          color: #d7d8b6;
        }

        .footer-title {
          color: #ffffff;
          font-weight: 600;
          margin-bottom: 1rem;
          letter-spacing: 0.4px;
        }

        .footer-text {
          font-size: 0.95rem;
          line-height: 1.65;
          color: #e6e6d1;
          max-width: 95%;
        }

        /* Quick Links */
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 0.45rem;
        }

        .footer-links a {
          color: #d7d8b6;
          font-size: 0.95rem;
          transition: all 0.25s ease;
        }

        .footer-links a:hover {
          color: #ffffff;
          padding-left: 6px;
        }

        /* Contact */
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.95rem;
          margin-bottom: 0.65rem;
          color: #e6e6d1;
        }

        .contact-item svg {
          margin-top: 2px;
          flex-shrink: 0;
        }

        /* Social Icons */
        .social-links {
          display: flex;
          gap: 14px;
          margin-top: 0.5rem;
        }

        .social-links a {
          width: 42px;
          height: 42px;
          background-color: #d7d8b6;
          color: #535434;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .social-links a:hover {
          background-color: #ffffff;
          transform: translateY(-4px);
          box-shadow: 0 8px 18px rgba(0,0,0,0.25);
        }

        /* Bottom Bar */
        .footer-bottom {
          background-color: rgba(0, 0, 0, 0.18);
          color: #e0e0c8;
        }

        /* Mobile Optimizations */
        @media (max-width: 767px) {
          .footer-title {
            margin-top: 1rem;
          }

          .social-links {
            justify-content: flex-start;
          }

          .footer-text {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;
