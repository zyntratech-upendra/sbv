import { ArrowRight, School, Users, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

import img1 from "../assets/about_img.jpg";
import img2 from "../assets/classroom1.jpg";
import img3 from "../assets/classroom2.jpg";
import img4 from "../assets/classroom3.jpg";
import img5 from "../assets/react.svg";

const HomeHero = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">

            {/* LEFT CONTENT */}
            <div className="col-lg-6 text-center text-lg-start">
              <h1 className="hero-title">
                Empowering Education <br />
                <span>Through Smart Management</span>
              </h1>

              <p className="hero-subtitle">
                SBV School Management System empowers schools with structured
                academics, transparent administration, and a digitally
                connected learning ecosystem.
              </p>

              <div className="hero-highlights">
                <div className="highlight-item">
                  <School size={20} /> Structured academics
                </div>
                <div className="highlight-item">
                  <Users size={20} /> Student & teacher collaboration
                </div>
                <div className="highlight-item">
                  <BookOpen size={20} /> Smart attendance & insights
                </div>
              </div>

              <button
                className="btn hero-btn-secondary mt-3"
                onClick={() => navigate("/about")}
              >
                Learn More About Our School
                <ArrowRight size={18} />
              </button>
            </div>

            {/* RIGHT VISUAL */}
            <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center">
              <div className="carousel-wrapper">
                <div className="carousel-ring">
                  <div className="carousel-card c1"><img src={img1} /></div>
                  <div className="carousel-card c2"><img src={img2} /></div>
                  <div className="carousel-card c3"><img src={img3} /></div>
                  <div className="carousel-card c4"><img src={img4} /></div>
                  <div className="carousel-card c5"><img src={img5} /></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        * {
          font-family: 'Inter', sans-serif;
        }

        .hero-section {
          background: linear-gradient(180deg, #d7d8b6 0%, #f2f2e4 100%);
          padding: 5rem 0;
          overflow: hidden;
        }

        /* LEFT CONTENT */
        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          color: #535434;
          line-height: 1.25;
        }

        .hero-title span {
          color: #6a6b48;
        }

        .hero-subtitle {
          font-size: 1.05rem;
          color: #555;
          max-width: 560px;
          margin: 1.2rem 0 1.8rem;
          line-height: 1.7;
        }

        .hero-highlights {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #535434;
          font-weight: 500;
        }

        .hero-btn-secondary {
          margin-top: 1.5rem;
          background: transparent;
          color: #535434;
          font-weight: 600;
          padding: 0.7rem 1.8rem;
          border-radius: 30px;
          border: 2px solid #535434;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .hero-btn-secondary:hover {
          background: #535434;
          color: #fff;
          transform: translateY(-2px);
        }

        /* ================= CIRCULAR ROTATION (BIGGER CARDS) ================= */

        .carousel-wrapper {
          width: 480px;
          height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1600px;
        }

        .carousel-ring {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: rotateRing 26s linear infinite;
        }

        .carousel-card {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 360px;       /* ⬆️ increased */
          height: 230px;      /* ⬆️ increased */
          margin: -115px -180px;
          border-radius: 26px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 30px 65px rgba(0,0,0,0.28);
          transition: transform 0.6s ease, box-shadow 0.6s ease;
        }

        .carousel-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* POSITIONS */
        .c1 { transform: rotateY(0deg) translateZ(360px) scale(1); }
        .c2 { transform: rotateY(72deg) translateZ(360px) scale(0.95); }
        .c3 { transform: rotateY(144deg) translateZ(360px) scale(0.85); }
        .c4 { transform: rotateY(216deg) translateZ(360px) scale(0.85); }
        .c5 { transform: rotateY(288deg) translateZ(360px) scale(0.95); }

        @keyframes rotateRing {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }

        /* RESPONSIVE */
        @media (max-width: 992px) {
          .hero-title {
            font-size: 2.4rem;
          }

          .carousel-wrapper {
            transform: scale(0.8);
          }
        }

        @media (max-width: 768px) {
          .hero-title,
          .hero-subtitle {
            text-align: center;
          }

          .hero-highlights {
            align-items: center;
          }

          .hero-btn-secondary {
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </>
  );
};

export default HomeHero;
