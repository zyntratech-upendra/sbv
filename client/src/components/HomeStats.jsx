import { Users, GraduationCap, Award, BookOpen } from "lucide-react";

const HomeStats = () => {
  return (
    <>
      <section className="stats-section">
        <div className="container">

          {/* Section Header */}
          <div className="text-center mb-5">
            <h2 className="stats-title">Our School at a Glance</h2>
            <p className="stats-subtitle">
              Building strong foundations through quality education and values
            </p>
          </div>

          {/* Stats Grid */}
          <div className="row g-4">

            <div className="col-lg-3 col-md-6">
              <div className="stat-card">
                <Users size={36} />
                <h3>1200+</h3>
                <p>Students Enrolled</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="stat-card">
                <GraduationCap size={36} />
                <h3>80+</h3>
                <p>Qualified Teachers</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="stat-card">
                <Award size={36} />
                <h3>25+</h3>
                <p>Years of Excellence</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="stat-card">
                <BookOpen size={36} />
                <h3>98%</h3>
                <p>Student Success Rate</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= INTERNAL CSS ================= */}
      <style>{`
        .stats-section {
          background: #ffffff;
          padding: 5rem 0;
        }

        .stats-title {
          font-size: 2.4rem;
          font-weight: 800;
          color: #535434;
          margin-bottom: 0.6rem;
        }

        .stats-subtitle {
          color: #666;
          max-width: 620px;
          margin: auto;
          font-size: 1rem;
        }

        .stat-card {
          background: linear-gradient(180deg, #f2f2e4, #ffffff);
          border-radius: 22px;
          padding: 2.5rem 1.5rem;
          text-align: center;
          height: 100%;
          box-shadow: 0 20px 45px rgba(0,0,0,0.12);
          transition: all 0.35s ease;
        }

        .stat-card svg {
          color: #535434;
          margin-bottom: 1rem;
        }

        .stat-card h3 {
          font-size: 2rem;
          font-weight: 700;
          color: #535434;
          margin-bottom: 0.4rem;
        }

        .stat-card p {
          margin: 0;
          font-weight: 500;
          color: #555;
        }

        .stat-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 35px 70px rgba(0,0,0,0.2);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .stats-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
};

export default HomeStats;
