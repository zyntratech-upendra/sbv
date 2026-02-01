import { useEffect, useRef } from "react";
import { Mail, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomeCTA = () => {
  const navigate = useNavigate();
  const ctaRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("cta-visible");
        }
      },
      { threshold: 0.3 }
    );

    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="cta-clean-section">
      <div className="container py-5">
        <div className="cta-clean-card" ref={ctaRef}>

          {/* BACKGROUND DECOR */}
          <div className="cta-bg-shape shape-left" />
          <div className="cta-bg-shape shape-right" />

          <div className="row align-items-center g-5 position-relative">

            {/* LEFT CONTENT */}
            <div className="col-lg-7">
              <span className="cta-label">
                SCHOOL MANAGEMENT PLATFORM
              </span>

              <h2 className="cta-heading mt-3">
                A Smarter Way to
                <br />
                Manage Your Institution
              </h2>

              <p className="cta-text mt-3">
                SBV School Management System brings academics, administration,
                and communication together into one secure and easy-to-use
                digital platform.
              </p>

              <div className="cta-buttons mt-4">
                <button
                  className="btn btn-contact"
                  onClick={() => navigate("/contact")}
                >
                  <Mail size={18} />
                  Contact Us
                </button>

                <button
                  className="btn btn-about"
                  onClick={() => navigate("/about")}
                >
                  <Info size={18} />
                  About Our System
                </button>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="col-lg-5">
              <div className="cta-side-card">
                <h4>Built for Institutions</h4>
                <p>
                  Designed to support schools and colleges with structured
                  academics, transparent administration, and reliable data
                  management.
                </p>

                <div className="cta-stats">
                  <div>
                    <h5>500+</h5>
                    <span>Schools</span>
                  </div>
                  <div>
                    <h5>25K+</h5>
                    <span>Students</span>
                  </div>
                  <div>
                    <h5>99%</h5>
                    <span>Reliability</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        /* SECTION */
        .cta-clean-section {
          background: linear-gradient(180deg, #f6f7f2, #ffffff);
          overflow: hidden;
        }

        /* MAIN CARD */
        .cta-clean-card {
          position: relative;
          background: #ffffff;
          border-radius: 34px;
          padding: 4rem 3rem;
          box-shadow: 0 35px 100px rgba(0,0,0,0.12);
          opacity: 0;
          transform: translateY(80px);
          transition: all 0.9s ease;
          overflow: hidden;
        }

        .cta-clean-card.cta-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* BACKGROUND SHAPES */
        .cta-bg-shape {
          position: absolute;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.25;
          animation: bgDrift 22s ease-in-out infinite;
        }

        .shape-left {
          background: #6a6b48;
          top: -160px;
          left: -160px;
        }

        .shape-right {
          background: #8b8c5a;
          bottom: -180px;
          right: -160px;
          animation-delay: 8s;
        }

        @keyframes bgDrift {
          0%, 100% { transform: translate(0,0); }
          50% { transform: translate(45px, 35px); }
        }

        /* LEFT */
        .cta-label {
          display: inline-block;
          padding: 0.45rem 1.1rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1px;
          background: rgba(106,107,72,0.15);
          color: #535434;
        }

        .cta-heading {
          font-weight: 800;
          color: #535434;
          line-height: 1.25;
        }

        .cta-text {
          max-width: 520px;
          font-size: 1.05rem;
          color: #555;
        }

        /* BUTTONS */
        .cta-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-contact {
          background: linear-gradient(135deg, #6a6b48, #8b8c5a);
          color: #fff;
          font-weight: 700;
          padding: 0.85rem 2.1rem;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.35s ease;
        }

        .btn-contact:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 45px rgba(0,0,0,0.25);
        }

        .btn-about {
          background: transparent;
          color: #535434;
          border: 2px solid #6a6b48;
          font-weight: 600;
          padding: 0.8rem 2rem;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.35s ease;
        }

        .btn-about:hover {
          background: rgba(106,107,72,0.1);
          transform: translateY(-3px);
        }

        /* RIGHT PANEL */
        .cta-side-card {
          background: #f6f7f2;
          border-radius: 26px;
          padding: 2.6rem 2.2rem;
          height: 100%;
        }

        .cta-side-card h4 {
          color: #535434;
          font-weight: 700;
        }

        .cta-side-card p {
          font-size: 0.95rem;
          color: #555;
          margin-top: 0.6rem;
        }

        .cta-stats {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
          text-align: center;
        }

        .cta-stats h5 {
          margin: 0;
          font-weight: 800;
          color: #535434;
        }

        .cta-stats span {
          font-size: 0.75rem;
          color: #666;
        }

        /* RESPONSIVE */
        @media (max-width: 992px) {
          .cta-clean-card {
            padding: 3rem 2rem;
          }

          .cta-heading,
          .cta-text,
          .cta-buttons {
            text-align: center;
            margin-left: auto;
            margin-right: auto;
            justify-content: center;
          }

          .cta-side-card {
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .cta-heading {
            font-size: 1.8rem;
          }

          .cta-stats {
            gap: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default HomeCTA;
