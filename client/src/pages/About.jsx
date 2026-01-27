import {
  GraduationCap,
  BarChart3,
  ShieldCheck,
  Eye,
  Target
} from "lucide-react";
import schoolImg from "../assets/about_img.jpg"; // replace with real images later

const About = () => {
  return (
    <>
      {/* ================= ABOUT PAGE ================= */}
      <section className="about-section">
        <div className="container py-5">

          {/* ================= INTRO ================= */}
          <div className="row align-items-center gy-5 mb-5">

            {/* LEFT CONTENT */}
            <div className="col-lg-6">
              <h1 className="about-title">About SBV School</h1>
              <p className="about-text">
                SBV School is committed to nurturing young minds through quality
                education, discipline, and innovation. Our digital school
                management system ensures transparency, efficiency, and
                seamless academic administration.
              </p>

              <div className="about-points">
                <div className="point-card">
                  <GraduationCap size={22} />
                  <p>Student-centric learning approach</p>
                </div>
                <div className="point-card">
                  <BarChart3 size={22} />
                  <p>Digitally managed attendance & academics</p>
                </div>
                <div className="point-card">
                  <ShieldCheck size={22} />
                  <p>Secure and transparent fee management</p>
                </div>
              </div>
            </div>

            {/* RIGHT FLOATING IMAGES */}
            <div className="col-lg-6 position-relative text-center">
              <div className="image-stack">
                <img src={schoolImg} alt="School Campus" className="img-main" />
                <img src={schoolImg} alt="Classroom" className="img-float img-1" />
                <img src={schoolImg} alt="Students" className="img-float img-2" />
              </div>
            </div>

          </div>

          {/* ================= VISION & MISSION ================= */}
          <div className="row gy-4 mt-4">
            <div className="col-md-6">
              <div className="vm-card">
                <Eye size={32} />
                <h3>Our Vision</h3>
                <p>
                  To become a leading educational institution that empowers
                  students with knowledge, values, and digital excellence for
                  a brighter future.
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="vm-card">
                <Target size={32} />
                <h3>Our Mission</h3>
                <p>
                  To provide holistic education through innovative teaching,
                  strong discipline, modern technology, and continuous
                  improvement in academic excellence.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= INTERNAL CSS ================= */}
      <style>{`
        * {
          font-family: 'Inter', sans-serif;
        }

        .about-section {
          background: linear-gradient(180deg, #d7d8b6 0%, #f2f2e4 100%);
          overflow: hidden;
        }

        /* Title */
        .about-title {
          font-size: 2.6rem;
          font-weight: 700;
          color: #535434;
          margin-bottom: 1rem;
          animation: fadeUp 0.8s ease forwards;
        }

        .about-text {
          font-size: 1.05rem;
          color: #444;
          line-height: 1.75;
          margin-bottom: 2rem;
          animation: fadeUp 1s ease forwards;
        }

        /* About Points */
        .about-points {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .point-card {
          background: #ffffff;
          padding: 1.1rem 1.3rem;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          transition: all 0.35s ease;
          animation: fadeUp 1.2s ease forwards;
        }

        .point-card svg {
          color: #535434;
        }

        .point-card p {
          margin: 0;
          font-weight: 500;
          color: #535434;
        }

        .point-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 40px rgba(0,0,0,0.15);
        }

        /* Image Stack */
        .image-stack {
          position: relative;
          width: 100%;
          height: 400px;
        }

        .img-main {
          width: 70%;
          border-radius: 20px;
          box-shadow: 0 18px 45px rgba(0,0,0,0.25);
          animation: floatMain 6s ease-in-out infinite;
        }

        .img-float {
          position: absolute;
          width: 45%;
          border-radius: 18px;
          box-shadow: 0 14px 30px rgba(0,0,0,0.22);
          animation: floatSmall 5s ease-in-out infinite;
        }

        .img-1 {
          top: 8%;
          right: 0;
          animation-delay: 0.3s;
        }

        .img-2 {
          bottom: 0;
          left: 5%;
          animation-delay: 0.6s;
        }

        /* Vision & Mission */
        .vm-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 2rem;
          text-align: center;
          height: 100%;
          box-shadow: 0 16px 35px rgba(0,0,0,0.1);
          transition: all 0.35s ease;
          animation: fadeUp 1.4s ease forwards;
        }

        .vm-card svg {
          color: #535434;
          margin-bottom: 1rem;
        }

        .vm-card h3 {
          color: #535434;
          font-weight: 600;
          margin-bottom: 0.8rem;
        }

        .vm-card p {
          color: #555;
          line-height: 1.7;
        }

        .vm-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 55px rgba(0,0,0,0.18);
        }

        /* Animations */
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatMain {
          0% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0); }
        }

        @keyframes floatSmall {
          0% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
          100% { transform: translateY(0); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .about-title {
            font-size: 2rem;
            text-align: center;
          }

          .about-text {
            text-align: center;
          }

          .image-stack {
            height: 320px;
          }

          .img-main {
            width: 80%;
          }

          .img-float {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default About;
