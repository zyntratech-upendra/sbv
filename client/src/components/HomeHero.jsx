import { ArrowRight, School, Users, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import img1 from "../assets/about_img.jpg";
import img2 from "../assets/classroom1.jpg";
import img3 from "../assets/classroom2.jpg";
import img4 from "../assets/classroom3.jpg";
import img5 from "../assets/react.svg";
import img6 from "../assets/classroom1.jpg";

const HomeHero = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [img1, img2, img3, img4, img5, img6];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center gy-5">

            {/* LEFT CONTENT – UNCHANGED */}
            <div className="col-lg-6 text-center text-lg-start">
              <h1 className="hero-title">
                Empowering Education <br />
                <span>Through Smart Management</span>
              </h1>

              <p className="hero-subtitle">
                SBV School Management System enables structured academics,
                transparent administration, and a digitally connected learning
                ecosystem for modern institutions.
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
                className="btn hero-btn-secondary mt-4"
                onClick={() => navigate("/about")}
              >
                Learn More About Our School
                <ArrowRight size={18} />
              </button>
            </div>

            {/* RIGHT IMAGE GALLERY – UPDATED */}
            <div className="col-lg-6">
              <div className="hero-gallery">

                {/* MAIN SLIDER */}
                <div className="main-image">
                  <img
                    src={images[currentImageIndex]}
                    alt="School Campus"
                  />

                  <div className="image-dots">
                    {images.map((_, idx) => (
                      <span
                        key={idx}
                        className={`dot ${currentImageIndex === idx ? "active" : ""}`}
                        onClick={() => setCurrentImageIndex(idx)}
                      />
                    ))}
                  </div>
                </div>

                {/* THUMBNAILS */}
                <div className="thumbnail-row">
                  {images.slice(1, 5).map((img, idx) => (
                    <div className="thumb-card" key={idx}>
                      <img src={img} alt={`Thumb ${idx}`} />
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STYLES */}
      <style>{`
        * {
          font-family: 'Inter', sans-serif;
        }

        .hero-section {
          background: linear-gradient(180deg, #d7d8b6 0%, #f2f2e4 100%);
          padding: 5.5rem 0;
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
          margin: 1.3rem 0 1.9rem;
          line-height: 1.7;
        }

        .hero-highlights {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #535434;
          font-weight: 500;
        }

        .hero-btn-secondary {
          background: transparent;
          color: #535434;
          font-weight: 600;
          padding: 0.75rem 1.9rem;
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

        /* RIGHT IMAGE GALLERY */
        .hero-gallery {
          width: 100%;
        }

        .main-image {
          position: relative;
          overflow: hidden;
          border-radius: 26px;
          box-shadow: 0 30px 70px rgba(0,0,0,0.25);
        }

        .main-image img {
          width: 100%;
          height: 360px;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .main-image:hover img {
          transform: scale(1.08);
        }

        .image-dots {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }

        .dot {
          width: 10px;
          height: 10px;
          background: rgba(255,255,255,0.6);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot.active {
          background: #535434;
          transform: scale(1.2);
        }

        .thumbnail-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 20px;
        }

        .thumb-card {
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(0,0,0,0.18);
          transition: transform 0.4s ease;
        }

        .thumb-card img {
          width: 100%;
          height: 110px;
          object-fit: cover;
        }

        .thumb-card:hover {
          transform: translateY(-6px) scale(1.05);
        }

        /* RESPONSIVE */
        @media (max-width: 992px) {
          .hero-title {
            font-size: 2.4rem;
          }

          .main-image img {
            height: 300px;
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

          .thumbnail-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
};

export default HomeHero;
