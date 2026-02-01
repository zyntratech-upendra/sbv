import {
  School,
  Users,
  BookOpen,
  ClipboardCheck,
  IndianRupee,
  BarChart3,
} from "lucide-react";

const HomeFeatures = () => {
  const features = [
    {
      icon: <School size={34} />,
      title: "Academic Management",
      desc: "Manage classes, subjects, timetables, and curriculum in a structured way.",
    },
    {
      icon: <Users size={34} />,
      title: "Student & Teacher Portal",
      desc: "Role-based dashboards for students, teachers, and administrators.",
    },
    {
      icon: <ClipboardCheck size={34} />,
      title: "Attendance Tracking",
      desc: "Smart daily attendance with real-time insights and reports.",
    },
    {
      icon: <BookOpen size={34} />,
      title: "Exams & Grades",
      desc: "Online exam scheduling, marks entry, and performance evaluation.",
    },
    {
      icon: <IndianRupee size={34} />,
      title: "Fees Management",
      desc: "Track fee collection, dues, receipts, and payment history easily.",
    },
    {
      icon: <BarChart3 size={34} />,
      title: "Reports & Analytics",
      desc: "Detailed reports for attendance, academics, and overall performance.",
    },
  ];

  return (
    <section className="home-features-section">
      <div className="container py-5">

        {/* SECTION HEADER */}
        <div className="text-center mb-5">
          <h2 className="fw-bold section-title">
            Powerful Features for Smart Schools
          </h2>
          <p className="text-muted mt-2 section-subtitle">
            Everything you need to manage academics, administration, and
            communication — all in one platform.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="row g-4">
          {features.map((item, index) => (
            <div className="col-sm-6 col-lg-4" key={index}>
              <div className="feature-card h-100">
                <div className="feature-icon">{item.icon}</div>
                <h5 className="fw-semibold mt-3">{item.title}</h5>
                <p className="text-muted mt-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* STYLES */}
      <style>{`
        .home-features-section {
          background: #f9fafb;
        }

        .section-title {
          color: #535434;
        }

        .section-subtitle {
          max-width: 620px;
          margin: 0 auto;
          font-size: 1.05rem;
        }

        .feature-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 2.2rem 1.8rem;
          box-shadow: 0 18px 45px rgba(0,0,0,0.08);
          transition: all 0.35s ease;
          text-align: center;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 70px rgba(0,0,0,0.15);
        }

        .feature-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6a6b48, #8b8c5a);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 1.7rem;
          }

          .feature-card {
            padding: 1.8rem 1.4rem;
          }
        }
      `}</style>
    </section>
  );
};

export default HomeFeatures;
