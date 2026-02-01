import { Settings, Users, CalendarCheck, BarChart3 } from "lucide-react";

const HomeWorkflow = () => {
  const steps = [
    {
      icon: <Settings size={30} />,
      title: "Admin Setup",
      desc: "Administrator configures classes, subjects, teachers, and academic structure.",
    },
    {
      icon: <Users size={30} />,
      title: "User Management",
      desc: "Students, teachers, and parents are added with role-based access.",
    },
    {
      icon: <CalendarCheck size={30} />,
      title: "Daily Operations",
      desc: "Attendance, exams, assignments, and fee tracking handled digitally.",
    },
    {
      icon: <BarChart3 size={30} />,
      title: "Reports & Insights",
      desc: "Generate detailed reports for performance, attendance, and analytics.",
    },
  ];

  return (
    <section className="home-workflow-section">
      <div className="container py-5">

        {/* HEADER */}
        <div className="text-center mb-5">
          <h2 className="fw-bold section-title">
            How SBV School Management System Works
          </h2>
          <p className="text-muted mt-2 section-subtitle">
            A simple and effective workflow designed for schools of all sizes.
          </p>
        </div>

        {/* STEPS */}
        <div className="row g-4 justify-content-center">
          {steps.map((step, index) => (
            <div className="col-sm-6 col-lg-3" key={index}>
              <div className="workflow-card h-100">

                {/* STEP RIBBON */}
                <div className="step-ribbon">
                  {index + 1}
                </div>

                {/* ICON */}
                <div className="workflow-icon">
                  {step.icon}
                </div>

                {/* CONTENT */}
                <h5 className="fw-bold mt-4">{step.title}</h5>
                <p className="text-muted mt-2">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* STYLES */}
      <style>{`
        .home-workflow-section {
          background: linear-gradient(180deg, #ffffff 0%, #f5f6f0 100%);
        }

        .section-title {
          color: #535434;
        }

        .section-subtitle {
          max-width: 640px;
          margin: 0 auto;
          font-size: 1.05rem;
        }

        /* CARD */
        .workflow-card {
          position: relative;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(10px);
          border-radius: 26px;
          padding: 2.8rem 1.8rem 2.2rem;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          transition: all 0.4s ease;
          overflow: hidden;
        }

        .workflow-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(106,107,72,0.12),
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .workflow-card:hover::before {
          opacity: 1;
        }

        .workflow-card:hover {
          transform: translateY(-14px);
          box-shadow: 0 35px 80px rgba(0,0,0,0.18);
        }

        /* STEP RIBBON */
        .step-ribbon {
          position: absolute;
          top: 0;
          left: 0;
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #6a6b48, #8b8c5a);
          color: #fff;
          font-weight: 800;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom-right-radius: 22px;
        }

        /* ICON */
        .workflow-icon {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6a6b48, #8b8c5a);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 14px 30px rgba(0,0,0,0.2);
          transition: transform 0.4s ease;
        }

        .workflow-card:hover .workflow-icon {
          transform: scale(1.15) rotate(6deg);
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 1.7rem;
          }

          .workflow-card {
            padding: 2.4rem 1.4rem 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default HomeWorkflow;
