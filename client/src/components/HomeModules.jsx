import {
  ShieldCheck,
  UserCog,
  GraduationCap,
  Users,
  ArrowRight,
} from "lucide-react";

const HomeModules = () => {
  const modules = [
    {
      icon: <ShieldCheck size={34} />,
      title: "Admin Dashboard",
      desc: "Complete control over academics, staff, students, fees, and system settings.",
      points: ["Classes & Subjects", "User Management", "Reports & Analytics"],
      accent: "admin",
    },
    {
      icon: <UserCog size={34} />,
      title: "Teacher Panel",
      desc: "Simplified tools for attendance, exams, assignments, and student tracking.",
      points: ["Attendance", "Marks Entry", "Assignments"],
      accent: "teacher",
    },
    {
      icon: <GraduationCap size={34} />,
      title: "Student Portal",
      desc: "Students can view attendance, exams, results, and assignments in one place.",
      points: ["Timetable", "Results", "Homework"],
      accent: "student",
    },
    {
      icon: <Users size={34} />,
      title: "Parent Access",
      desc: "Parents stay informed with real-time updates on attendance and performance.",
      points: ["Attendance View", "Performance", "Notifications"],
      accent: "parent",
    },
  ];

  return (
    <section className="home-modules-section">
      <div className="container py-5">

        {/* HEADER */}
        <div className="text-center mb-5">
          <h2 className="fw-bold section-title">
            Role-Based Modules for Every User
          </h2>
          <p className="text-muted section-subtitle mt-2">
            Each user gets a personalized dashboard designed for clarity,
            speed, and efficiency.
          </p>
        </div>

        {/* MODULE CARDS */}
        <div className="row g-4">
          {modules.map((module, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className={`module-card ${module.accent}`}>

                {/* ICON */}
                <div className="module-icon">
                  {module.icon}
                </div>

                {/* CONTENT */}
                <h5 className="fw-bold mt-4">{module.title}</h5>
                <p className="text-muted mt-2 small">{module.desc}</p>

                {/* POINTS */}
                <ul className="module-points">
                  {module.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="module-link">
                  Explore
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* STYLES */}
      <style>{`
        .home-modules-section {
          background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
        }

        .section-title {
          color: #535434;
        }

        .section-subtitle {
          max-width: 640px;
          margin: 0 auto;
          font-size: 1.05rem;
        }

        /* MODULE CARD */
        .module-card {
          position: relative;
          height: 100%;
          padding: 2.6rem 2rem 2.4rem;
          border-radius: 28px;
          background: #ffffff;
          box-shadow: 0 18px 50px rgba(0,0,0,0.1);
          transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .module-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0,0,0,0.04),
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .module-card:hover::before {
          opacity: 1;
        }

        .module-card:hover {
          transform: translateY(-14px);
          box-shadow: 0 35px 90px rgba(0,0,0,0.18);
        }

        /* ICON */
        .module-icon {
          width: 78px;
          height: 78px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 16px 35px rgba(0,0,0,0.2);
          transition: transform 0.4s ease;
        }

        .module-card:hover .module-icon {
          transform: rotate(6deg) scale(1.12);
        }

        /* ACCENTS */
        .module-card.admin .module-icon {
          background: linear-gradient(135deg, #374151, #111827);
        }

        .module-card.teacher .module-icon {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
        }

        .module-card.student .module-icon {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .module-card.parent .module-icon {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        /* POINTS */
        .module-points {
          list-style: none;
          padding: 0;
          margin: 1.2rem 0 1.6rem;
        }

        .module-points li {
          font-size: 0.9rem;
          color: #444;
          padding-left: 1.2rem;
          position: relative;
          margin-bottom: 0.4rem;
        }

        .module-points li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #6a6b48;
          font-size: 1.2rem;
        }

        /* CTA */
        .module-link {
          font-weight: 600;
          color: #535434;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: gap 0.3s ease;
        }

        .module-card:hover .module-link {
          gap: 12px;
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 1.7rem;
          }

          .module-card {
            padding: 2.2rem 1.6rem;
          }
        }
      `}</style>
    </section>
  );
};

export default HomeModules;
