import { useEffect, useState } from "react";
import { teacherAPI } from "../../utils/api";
import { AlertCircle, Users, BookOpen } from "lucide-react";
import TeacherLayout from "../TeacherLayout";

const TeacherClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeacherClasses();
  }, []);

  const fetchTeacherClasses = async () => {
    try {
      setLoading(true);
      const res = await teacherAPI.getClasses();
      setClasses(res.data.classes || []);
      setError("");
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError(err.response?.data?.message || "Error loading classes");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="dashboard-container">

        {/* HEADER */}
        <div className="mb-4">
          <h2 className="dashboard-title">My Classes</h2>
          <p className="dashboard-subtitle">
            Classes and batches assigned to you
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="loading-card">Loading your classes…</div>
        ) : (
          <div className="row g-4">
            {classes.length > 0 ? (
              classes.map((cls) => (
                <div key={cls._id} className="col-12 col-md-6 col-xl-4">
                  <div className="class-card">
                    <div className="class-icon">
                      <BookOpen size={22} />
                    </div>

                    <h5 className="class-title">{cls.name}</h5>

                    <div className="class-meta">
                      <p>
                        <span>Batch:</span>{" "}
                        {cls.batchId?.name || "N/A"}
                      </p>
                      <p>
                        <span>Section:</span>{" "}
                        {cls.sectionId?.name || "N/A"}
                      </p>
                    </div>

                    <div className="class-footer">
                      <Users size={16} />
                      <span>
                        {cls.students?.length || 0} Students
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="empty-card">
                  <AlertCircle size={42} />
                  <h5>No classes assigned</h5>
                  <p>
                    Please contact the administrator to assign classes
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* INTERNAL CSS */}
        <style>{`
          * {
            font-family: 'Inter', sans-serif;
          }

          .dashboard-title {
            font-weight: 700;
            color: #065f46;
          }

          .dashboard-subtitle {
            color: #6b7280;
          }

          .loading-card {
            background: #ffffff;
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          }

          /* CLASS CARD */
          .class-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 1.6rem;
            height: 100%;
            box-shadow: 0 14px 34px rgba(0,0,0,0.12);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            display: flex;
            flex-direction: column;
          }

          .class-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 18px 40px rgba(0,0,0,0.18);
          }

          .class-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: #ecfdf5;
            color: #0f766e;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
          }

          .class-title {
            font-weight: 600;
            color: #064e3b;
            margin-bottom: 0.75rem;
          }

          .class-meta p {
            margin: 0;
            font-size: 0.9rem;
            color: #4b5563;
          }

          .class-meta span {
            font-weight: 600;
            color: #065f46;
          }

          .class-footer {
            margin-top: auto;
            padding-top: 0.8rem;
            border-top: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.85rem;
            color: #374151;
          }

          /* EMPTY */
          .empty-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            box-shadow: 0 14px 34px rgba(0,0,0,0.12);
            color: #6b7280;
          }

          .empty-card h5 {
            margin-top: 1rem;
            color: #374151;
          }
        `}</style>
      </div>
    </TeacherLayout>
  );
};

export default TeacherClasses;
