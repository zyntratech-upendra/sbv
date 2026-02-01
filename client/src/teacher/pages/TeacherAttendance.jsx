import TeacherLayout from "../TeacherLayout";
import AttendanceTaking from "./AttendanceTaking";

const TeacherAttendance = () => {
  return (
    <TeacherLayout>
      <div className="dashboard-container">

        {/* HEADER */}
        <div className="mb-4">
          <h2 className="dashboard-title">Mark Attendance</h2>
          <p className="dashboard-subtitle">
            Select class and mark student attendance
          </p>
        </div>

        {/* CONTENT */}
        <div className="panel">
          <AttendanceTaking />
        </div>

        {/* INTERNAL CSS */}
        <style>{`
          * {
            font-family: 'Inter', sans-serif;
          }

          .dashboard-container {
            animation: fadeIn 0.4s ease;
          }

          .dashboard-title {
            font-weight: 700;
            color: #065f46;
          }

          .dashboard-subtitle {
            color: #6b7280;
            font-size: 0.95rem;
          }

          .panel {
            background: #ffffff;
            border-radius: 20px;
            padding: 1.6rem;
            box-shadow: 0 14px 34px rgba(0,0,0,0.12);
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </TeacherLayout>
  );
};

export default TeacherAttendance;
