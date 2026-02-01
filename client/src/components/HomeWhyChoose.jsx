import {
  ShieldCheck,
  Lock,
  Cloud,
  Zap,
  Layers,
  Headphones,
} from "lucide-react";

const HomeWhyChoose = () => {
  const reasons = [
    {
      icon: <ShieldCheck size={26} />,
      title: "Enterprise Security",
      desc: "Role-based access with strong data protection.",
    },
    {
      icon: <Layers size={26} />,
      title: "Unified Platform",
      desc: "All academic & admin modules in one place.",
    },
    {
      icon: <Zap size={26} />,
      title: "High Performance",
      desc: "Fast dashboards optimized for daily usage.",
    },
    {
      icon: <Cloud size={26} />,
      title: "Cloud Native",
      desc: "Anytime access with automatic backups.",
    },
    {
      icon: <Lock size={26} />,
      title: "Role Isolation",
      desc: "Admin, teacher, student & parent separation.",
    },
    {
      icon: <Headphones size={26} />,
      title: "Dedicated Support",
      desc: "Onboarding, training & ongoing assistance.",
    },
  ];

  return (
    <section className="why-neo-section">
      <div className="container py-5 position-relative">

        {/* ANIMATED BACKGROUND */}
        <div className="neo-bg" />
        <div className="neo-bg neo-bg-2" />

        {/* HEADER */}
        <div className="text-center mb-5">
          <span className="neo-pill">WHY CHOOSE SBV</span>

          <h2 className="neo-title mt-3">
            Designed for Schools That
            <br />
            Expect More from Software
          </h2>

          <p className="neo-desc mt-3">
            SBV blends performance, simplicity, and reliability into one
            beautifully engineered school management platform.
          </p>
        </div>

        {/* CARDS */}
        <div className="neo-grid">
          {reasons.map((item, index) => (
            <div
              className="neo-card"
              style={{ animationDelay: `${index * 0.15}s` }}
              key={index}
            >
              <div className="neo-icon">{item.icon}</div>
              <h6 className="fw-bold mt-3">{item.title}</h6>
              <p className="text-muted small mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>

      {/* STYLES */}
      <style>{`
        .why-neo-section {
          position: relative;
          background: linear-gradient(180deg, #ffffff, #f4f6f0);
          overflow: hidden;
        }

        /* BACKGROUND MOTION */
        .neo-bg {
          position: absolute;
          width: 420px;
          height: 420px;
          background: radial-gradient(circle, #6a6b48, transparent 65%);
          top: -120px;
          left: -140px;
          opacity: 0.25;
          filter: blur(90px);
          animation: floatBg 18s ease-in-out infinite;
        }

        .neo-bg-2 {
          top: auto;
          left: auto;
          bottom: -140px;
          right: -120px;
          animation-delay: 6s;
        }

        @keyframes floatBg {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(40px) translateX(30px);
          }
        }

        /* HEADER */
        .neo-pill {
          display: inline-block;
          padding: 0.45rem 1.2rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1px;
          background: rgba(106,107,72,0.15);
          color: #535434;
        }

        .neo-title {
          font-weight: 800;
          color: #535434;
          line-height: 1.25;
        }

        .neo-desc {
          max-width: 620px;
          margin: 0 auto;
          font-size: 1.05rem;
        }

        /* GRID */
        .neo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.2rem;
          margin-top: 4.5rem;
        }

        /* CARD */
        .neo-card {
          position: relative;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(16px);
          border-radius: 28px;
          padding: 2.2rem 1.9rem;
          text-align: center;
          box-shadow: 0 25px 60px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.6);
          animation: revealUp 0.9s ease forwards;
          opacity: 0;
          transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .neo-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 28px;
          background: linear-gradient(
            135deg,
            rgba(106,107,72,0.35),
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .neo-card:hover::before {
          opacity: 1;
        }

        .neo-card:hover {
          transform: translateY(-16px) scale(1.04);
          box-shadow: 0 45px 110px rgba(0,0,0,0.18);
        }

        /* ICON */
        .neo-icon {
          width: 60px;
          height: 60px;
          border-radius: 20px;
          background: linear-gradient(135deg, #6a6b48, #8b8c5a);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 18px 40px rgba(0,0,0,0.25);
          transition: transform 0.45s ease;
        }

        .neo-card:hover .neo-icon {
          transform: rotate(8deg) scale(1.15);
        }

        /* REVEAL */
        @keyframes revealUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* RESPONSIVE */
        @media (max-width: 992px) {
          .neo-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .neo-title {
            font-size: 1.8rem;
          }

          .neo-grid {
            grid-template-columns: 1fr;
            gap: 1.6rem;
          }
        }
      `}</style>
    </section>
  );
};

export default HomeWhyChoose;
