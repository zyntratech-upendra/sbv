import { useEffect, useState } from "react";
import { teacherAPI } from "../../utils/api";
import { User, Mail, Phone, Award, BookOpen } from "lucide-react";
import TeacherLayout from "../TeacherLayout";

const TeacherProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    qualifications: "",
    specialization: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await teacherAPI.getProfile();
      const p = res.data.profile;
      setProfile(p);
      setFormData({
        name: p.name || "",
        phone: p.phone || "",
        qualifications: p.qualifications || "",
        specialization: p.specialization || "",
      });
    } catch (err) {
      console.error("Profile fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await teacherAPI.updateProfile(formData);
      await fetchProfile();
      setEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <TeacherLayout>
      <div className="profile-page">

        {/* HEADER */}
        <div className="page-header mb-4">
          <h2>My Profile</h2>
          <p>Manage your personal and professional information</p>
        </div>

        {loading ? (
          <div className="loading-card">Loading profile…</div>
        ) : (
          <div className="row g-4">
            {/* LEFT PROFILE CARD */}
            <div className="col-12 col-lg-4">
              <div className="profile-card">
                <div className="avatar-xl">
                  {profile?.name?.[0] || "T"}
                </div>

                <h4>{profile?.name}</h4>
                <p className="role">{profile?.role || "Teacher"}</p>

                <div className="divider" />

                <ProfileMini icon={<Mail size={16} />} value={profile?.email} />
                <ProfileMini icon={<Phone size={16} />} value={profile?.phone || "N/A"} />

                <button
                  className={`btn w-100 mt-3 ${
                    editing ? "btn-outline-danger" : "btn-outline-success"
                  }`}
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? "Cancel Editing" : "Edit Profile"}
                </button>
              </div>
            </div>

            {/* RIGHT DETAILS */}
            <div className="col-12 col-lg-8">
              <div className="panel">

                <h5 className="section-title">
                  {editing ? "Edit Information" : "Profile Information"}
                </h5>

                {editing ? (
                  <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Qualifications</label>
                      <textarea
                        name="qualifications"
                        rows="3"
                        className="form-control"
                        value={formData.qualifications}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Specialization</label>
                      <input
                        type="text"
                        name="specialization"
                        className="form-control"
                        value={formData.specialization}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <button className="btn btn-success w-100 py-2">
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="info-grid">
                    <ProfileItem
                      icon={<BookOpen />}
                      label="Department"
                      value={profile?.department || "N/A"}
                    />
                    <ProfileItem
                      icon={<Award />}
                      label="Qualifications"
                      value={profile?.qualifications || "N/A"}
                    />
                    <ProfileItem
                      icon={<User />}
                      label="Specialization"
                      value={profile?.specialization || "N/A"}
                    />
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* ================= STYLES ================= */}
        <style>{`
          * {
            font-family: 'Inter', sans-serif;
          }

          .profile-page {
            animation: fadeIn 0.4s ease;
          }

          .page-header h2 {
            font-weight: 700;
            color: #065f46;
          }

          .page-header p {
            color: #6b7280;
          }

          .loading-card {
            background: #fff;
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          }

          /* LEFT CARD */
          .profile-card {
            background: linear-gradient(180deg, #0f766e, #115e59);
            color: #ffffff;
            border-radius: 22px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.25);
          }

          .avatar-xl {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.2rem;
            font-weight: 800;
            margin: 0 auto 1rem;
          }

          .profile-card h4 {
            margin-bottom: 0.25rem;
          }

          .role {
            font-size: 0.85rem;
            opacity: 0.85;
          }

          .divider {
            height: 1px;
            background: rgba(255,255,255,0.3);
            margin: 1.2rem 0;
          }

          .profile-mini {
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: center;
            font-size: 0.85rem;
            opacity: 0.9;
            margin-bottom: 0.5rem;
          }

          /* RIGHT PANEL */
          .panel {
            background: #ffffff;
            border-radius: 22px;
            padding: 2rem;
            box-shadow: 0 14px 34px rgba(0,0,0,0.12);
            height: 100%;
          }

          .section-title {
            font-weight: 600;
            color: #065f46;
            margin-bottom: 1.5rem;
          }

          .info-grid {
            display: grid;
            gap: 1.2rem;
          }

          .profile-item {
            display: flex;
            gap: 12px;
            padding: 1rem;
            border-radius: 14px;
            background: #ecfdf5;
          }

          .profile-item-icon {
            color: #0f766e;
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

/* SMALL COMPONENTS */
const ProfileMini = ({ icon, value }) => (
  <div className="profile-mini">
    {icon}
    <span>{value}</span>
  </div>
);

const ProfileItem = ({ icon, label, value }) => (
  <div className="profile-item">
    <div className="profile-item-icon">{icon}</div>
    <div>
      <div className="small text-muted">{label}</div>
      <div className="fw-semibold">{value}</div>
    </div>
  </div>
);

export default TeacherProfile;
