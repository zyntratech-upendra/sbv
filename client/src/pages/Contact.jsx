import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <>
    <Navbar/>
      {/* ================= CONTACT PAGE ================= */}
      <section className="contact-section">
        <div className="container py-5">

          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="contact-title">Contact SBV School</h1>
            <p className="contact-subtitle">
              We are always happy to answer your questions and assist you.
            </p>
          </div>

          <div className="row gy-5 align-items-stretch">

            {/* Contact Info */}
            <div className="col-lg-5">
              <div className="contact-info-card">
                <h4>Get in Touch</h4>

                <div className="info-item">
                  <MapPin size={18} />
                  <span>
                    Green Valley School,<br />
                    MG Road, Hyderabad, Telangana
                  </span>
                </div>

                <div className="info-item">
                  <Phone size={18} />
                  <span>+91 98765 43210</span>
                </div>

                <div className="info-item">
                  <Mail size={18} />
                  <span>info@sbvschool.com</span>
                </div>

                <div className="info-item">
                  <Clock size={18} />
                  <span>Mon – Sat : 9:00 AM – 4:00 PM</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-7">
              <div className="contact-form-card">
                <h4>Send Us a Message</h4>

                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Subject"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Write your message here..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn send-btn">
                    <Send size={16} />
                    Send Message
                  </button>
                </form>
              </div>
            </div>

          </div>

          {/* Map Placeholder */}
          <div className="map-section mt-5">
            <div className="map-placeholder">
              📍 Map will be embedded here
            </div>
          </div>

        </div>
      </section>

      {/* ================= INTERNAL CSS ================= */}
      <style>{`
        * {
          font-family: 'Inter', sans-serif;
        }

        .contact-section {
          background: linear-gradient(180deg, #d7d8b6 0%, #f2f2e4 100%);
        }

        .contact-title {
          font-size: 2.6rem;
          font-weight: 700;
          color: #535434;
          margin-bottom: 0.5rem;
        }

        .contact-subtitle {
          color: #555;
          font-size: 1.05rem;
        }

        /* Info Card */
        .contact-info-card {
          background: #535434;
          color: #d7d8b6;
          border-radius: 20px;
          padding: 2.2rem;
          height: 100%;
          box-shadow: 0 18px 40px rgba(0,0,0,0.2);
        }

        .contact-info-card h4 {
          color: #ffffff;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .info-item {
          display: flex;
          gap: 12px;
          margin-bottom: 1.2rem;
          align-items: flex-start;
          font-size: 0.95rem;
        }

        .info-item svg {
          margin-top: 3px;
          flex-shrink: 0;
        }

        /* Form Card */
        .contact-form-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 2.2rem;
          height: 100%;
          box-shadow: 0 16px 35px rgba(0,0,0,0.1);
        }

        .contact-form-card h4 {
          color: #535434;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .form-label {
          font-weight: 500;
          color: #535434;
        }

        .form-control {
          border-radius: 10px;
          padding: 0.6rem 0.9rem;
          border: 1px solid #ccc;
        }

        .form-control:focus {
          border-color: #535434;
          box-shadow: 0 0 0 0.15rem rgba(83,84,52,0.25);
        }

        /* Send Button */
        .send-btn {
          background-color: #535434;
          color: #ffffff;
          font-weight: 600;
          padding: 0.6rem 1.6rem;
          border-radius: 30px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .send-btn:hover {
          background-color: #6a6b48;
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(0,0,0,0.15);
        }

        /* Map */
        .map-placeholder {
          background: #ffffff;
          border-radius: 18px;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #535434;
          font-weight: 500;
          box-shadow: 0 14px 30px rgba(0,0,0,0.1);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .contact-title {
            font-size: 2rem;
          }

          .contact-info-card,
          .contact-form-card {
            padding: 1.8rem;
          }
        }
      `}</style>
      <Footer/>
    </>
  );
};

export default Contact;
