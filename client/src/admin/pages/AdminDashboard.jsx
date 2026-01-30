import AdminLayout from "../AdminLayout";
import StatCard from "../components/StatCard";
import { Users, GraduationCap, BookOpen } from "lucide-react";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="row g-4">
        <div className="col-md-4 col-sm-6">
          <StatCard title="Students" value="320" icon={<Users />} />
        </div>
        <div className="col-md-4 col-sm-6">
          <StatCard title="Teachers" value="25" icon={<GraduationCap />} />
        </div>
        <div className="col-md-4 col-sm-12">
          <StatCard title="Attendance" value="92%" icon={<BookOpen />} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
