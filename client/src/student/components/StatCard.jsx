const StatCard = ({ title, value, icon, accent = "#535434" }) => {
  return (
    <>
      <div className="stat-card" style={{ "--accent": accent }}>
        <div className="stat-left">
          <p className="stat-title">{title}</p>
          <h3 className="stat-value">{value}</h3>
        </div>

        <div className="stat-icon">
          {icon}
        </div>
      </div>

      {/* ================= INTERNAL CSS ================= */}
      <style>{`
        * {
          font-family: 'Inter', sans-serif;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 1.6rem 1.8rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 14px 34px rgba(0,0,0,0.12);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        /* Accent strip */
        .stat-card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 6px;
          height: 100%;
          background: var(--accent);
          border-radius: 18px 0 0 18px;
        }

        .stat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 45px rgba(0,0,0,0.18);
        }

        .stat-left {
          padding-left: 0.6rem;
        }

        .stat-title {
          margin: 0;
          font-size: 0.9rem;
          color: #777;
          font-weight: 500;
        }

        .stat-value {
          margin: 0.25rem 0 0;
          font-size: 1.9rem;
          font-weight: 700;
          color: #535434;
          letter-spacing: 0.4px;
        }

        .stat-icon {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 10px 22px rgba(0,0,0,0.18);
        }

        /* Responsive */
        @media (max-width: 576px) {
          .stat-card {
            padding: 1.3rem 1.4rem;
          }

          .stat-value {
            font-size: 1.6rem;
          }

          .stat-icon {
            width: 46px;
            height: 46px;
          }
        }
      `}</style>
    </>
  );
};

export default StatCard;
