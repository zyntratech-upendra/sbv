import { useState, useEffect } from "react";
import { studentAPI } from "../../utils/api";
import { User, Mail, Phone, Calendar } from "lucide-react";
import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";

export default function StudentProfile() {
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
      const response = await studentAPI.getProfile();
      setProfile(response.data.profile);
      setFormData({
        name: response.data.profile.name,
        phone: response.data.profile.phone,
        address: response.data.profile.address,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.updateProfile(formData);
      await fetchProfile();
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error updating profile: " + error.response?.data?.message);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentTopbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <User size={32} />
              My Profile
            </h1>
            <p className="text-gray-600 mb-8">View and update your profile information</p>

            <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {profile?.name?.[0] || "S"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{profile?.name}</h2>
                    <p className="text-gray-600">{profile?.registrationNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
                >
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <Mail className="text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-lg text-gray-800">{profile?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pb-4 border-b">
                    <Phone className="text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-lg text-gray-800">{profile?.phone || "N/A"}</p>
                    </div>
                  </div>

                  <div className="pb-4 border-b">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-lg text-gray-800">{profile?.address || "N/A"}</p>
                  </div>

                  <div className="pb-4 border-b">
                    <p className="text-sm text-gray-600">Class</p>
                    <p className="text-lg text-gray-800">{profile?.classId?.name || "N/A"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Batch</p>
                    <p className="text-lg text-gray-800">{profile?.batchId?.name || "N/A"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
