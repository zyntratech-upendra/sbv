const StatCard = ({ title, value, icon }) => {
  return (
    <>
      <div className="stat-card">
        <div>
          <p>{title}</p>
          <h3>{value}</h3>
        </div>
        <div className="stat-icon">{icon}</div>
      </div>

      <style>{`
        .stat-card {
          background: #fff;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-6px);
        }

        .stat-card p {
          margin: 0;
          color: #777;
        }

        .stat-card h3 {
          margin: 0;
          color: #535434;
          font-weight: 700;
        }

        .stat-icon {
          font-size: 2rem;
          color: #535434;
        }
      `}</style>
    </>
  );
};

export default StatCard;
