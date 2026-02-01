import { useState } from "react";
import TeacherSidebar from "../components/TeacherSidebar";
import TeacherTopbar from "../components/TeacherTopbar";
import AttendanceReport from "./AttendanceReport";

export default function TeacherReports() {
  return (
    <div className="flex h-screen bg-gray-100">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TeacherTopbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Attendance Reports</h1>
            <AttendanceReport />
          </div>
        </main>
      </div>
    </div>
  );
}
