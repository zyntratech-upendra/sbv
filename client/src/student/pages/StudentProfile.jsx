import { useEffect, useState } from "react";
import { studentAPI } from "../../utils/api";
import { Mail, Phone, MapPin, User } from "lucide-react";
import StudentLayout from "../StudentLayout";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await studentAPI.getProfile();
      setProfile(res.data.profile);
      setFormData({
        name: res.data.profile.name || "",
        phone: res.data.profile.phone || "",
        address: res.data.profile.address || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await studentAPI.updateProfile(formData);
    await fetchProfile();
    setEditing(false);
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="loading-card">Loading profile…</div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="profile-page">

        {/* HEADER */}
        <div className="page-header">
          <h2 className="page-title">My Profile</h2>
          <p className="page-subtitle">
            Personal & academic information
          </p>
        </div>

        <div className="profile-grid">

          {/* LEFT – PROFILE SUMMARY */}
          <aside className="profile-sidebar">
            <div className="avatar-lg">
              {profile?.name?.[0] || "S"}
            </div>

            <h3>{profile?.name}</h3>
            <p className="reg">{profile?.registrationNumber}</p>

            <div className="divider" />

            <SummaryItem icon={<Mail size={16} />} text={profile?.email} />
            <SummaryItem icon={<Phone size={16} />} text={profile?.phone || "N/A"} />
            <SummaryItem icon={<MapPin size={16} />} text={profile?.address || "N/A"} />

            <button
              className="btn action-btn primary full"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancel Editing" : "Edit Profile"}
            </button>
          </aside>

          {/* RIGHT – DETAILS */}
          <section className="profile-content">

            {editing ? (
              <div className="card">
                <h4 className="card-title">Edit Profile</h4>

                <form onSubmit={handleSubmit} className="form-stack">
                  <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
                  <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                  <Textarea
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />

                  <button className="btn action-btn primary">
                    Save Changes
                  </button>
                </form>
              </div>
            ) : (
              <div className="card">
                <h4 className="card-title">Academic Details</h4>

                <DetailRow label="Class">
                  {profile?.classId?.name || "N/A"}
                </DetailRow>

                <DetailRow label="Batch">
                  {profile?.batchId?.name || "N/A"}
                </DetailRow>

                <DetailRow label="Status">
                  <span className="status">Active</span>
                </DetailRow>
              </div>
            )}

          </section>
        </div>

        {/* ================= CSS ================= */}
        <style>{`
          * { font-family: 'Inter', sans-serif; }

          .profile-page {
            animation: fadeIn .4s ease;
          }

          .page-title {
            font-weight: 700;
            color: #7a1f2b;
          }

          .page-subtitle {
            color: #777;
            font-size: .95rem;
          }

          .profile-grid {
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 1.5rem;
            margin-top: 1.5rem;
          }

          /* LEFT */
          .profile-sidebar {
            background: #fff;
            border-radius: 20px;
            padding: 1.6rem;
            box-shadow: 0 14px 34px rgba(0,0,0,.12);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: .8rem;
          }

          .avatar-lg {
            width: 96px;
            height: 96px;
            border-radius: 50%;
            background: linear-gradient(135deg, #7a1f2b, #4a2c2a);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 2.2rem;
            font-weight: 800;
          }

          .profile-sidebar h3 {
            margin: .4rem 0 0;
            color: #5b1620;
          }

          .reg {
            font-size: .85rem;
            color: #777;
          }

          .divider {
            width: 100%;
            height: 1px;
            background: #eee;
            margin: .8rem 0;
          }

          .summary-item {
            width: 100%;
            display: flex;
            gap: .6rem;
            font-size: .9rem;
            color: #555;
          }

          /* RIGHT */
          .profile-content .card {
            background: #fff;
            border-radius: 20px;
            padding: 1.8rem;
            box-shadow: 0 14px 34px rgba(0,0,0,.12);
          }

          .card-title {
            font-weight: 600;
            margin-bottom: 1rem;
            color: #5b1620;
          }

          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: .6rem 0;
            border-bottom: 1px solid #eee;
          }

          .detail-row:last-child {
            border-bottom: none;
          }

          .status {
            background: #e6f4ea;
            color: #166534;
            padding: .25rem .8rem;
            border-radius: 14px;
            font-size: .75rem;
            font-weight: 600;
          }

          /* FORM */
          .form-stack {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          label {
            font-size: .8rem;
            color: #666;
          }

          input, textarea {
            padding: .6rem .75rem;
            border-radius: 10px;
            border: 1px solid #ccc;
            outline: none;
          }

          input:focus, textarea:focus {
            border-color: #7a1f2b;
          }

          .action-btn.primary {
            background: #7a1f2b;
            color: #fff;
            border: none;
          }

          .action-btn.primary:hover {
            background: #5b1620;
          }

          .full { width: 100%; }

          .loading-card {
            background: #fff;
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 12px 30px rgba(0,0,0,.08);
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* RESPONSIVE */
          @media (max-width: 900px) {
            .profile-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </StudentLayout>
  );
};

/* ===== SMALL COMPONENTS ===== */
const SummaryItem = ({ icon, text }) => (
  <div className="summary-item">
    {icon} <span>{text}</span>
  </div>
);

const DetailRow = ({ label, children }) => (
  <div className="detail-row">
    <span>{label}</span>
    <strong>{children}</strong>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label>{label}</label>
    <input {...props} />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label>{label}</label>
    <textarea {...props} />
  </div>
);

export default StudentProfile;
