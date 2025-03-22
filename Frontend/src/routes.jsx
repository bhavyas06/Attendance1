import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Teacher components
import TeacherDashboard from '../components/features/teacherDashboard';
import CoursesPage from '../components/features/teacherCourses';
// import TeacherAttendance from '../components/features/teacherAttendance';
// import TeacherReports from '../components/features/teacherReports';
// import TeacherNotes from '../components/features/teacherNotes';
// import TeacherAnnouncements from '../components/features/teacherAnnouncements';
// import TeacherSettings from '../components/features/teacherSettings';

// Student components
import StudentDashboard from '../components/features/studentDashboard';
// import StudentCourses from '../components/features/studentCourses';
// import StudentAttendance from '../components/features/studentAttendance';
// import StudentReports from '../components/features/studentReports';
// import StudentSettings from '../components/features/studentSettings';

export const TeacherRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TeacherDashboard />} />
      <Route path="courses" element={<CoursesPage />} />
      {/* <Route path="attendance" element={<TeacherAttendance />} />
      <Route path="reports" element={<TeacherReports />} />
      <Route path="notes" element={<TeacherNotes />} />
      <Route path="announcements" element={<TeacherAnnouncements />} />
      <Route path="settings" element={<TeacherSettings />} /> */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentDashboard />} />
      {/* <Route path="courses" element={<StudentCourses />} />
      <Route path="attendance" element={<StudentAttendance />} />
      <Route path="reports" element={<StudentReports />} />
      <Route path="settings" element={<StudentSettings />} /> */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main dashboard component that handles role-based routing
const DashboardRoutes = ({ role }) => {
  return role === 'teacher' ? <TeacherRoutes /> : <StudentRoutes />;
};

export default DashboardRoutes;