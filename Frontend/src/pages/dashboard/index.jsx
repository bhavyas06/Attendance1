import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaUserGraduate, FaBook, FaCalendarAlt } from 'react-icons/fa';
import DashboardLayout from "../../components/features/dashboardLayout";
import "./index.css";

const TeacherDashboard = () => {
  const [enrollmentRequests, setEnrollmentRequests] = useState([
    { id: 1, studentName: 'Sarah Johnson', studentId: 'STU10023', courseCode: 'CS101', courseName: 'Introduction to Programming', requestDate: '2025-03-20T10:30:00', status: 'pending' },
    { id: 2, studentName: 'Michael Chen', studentId: 'STU10045', courseCode: 'CS202', courseName: 'Data Structures', requestDate: '2025-03-21T14:15:00', status: 'pending' },
    { id: 3, studentName: 'Jennifer Williams', studentId: 'STU10078', courseCode: 'MATH201', courseName: 'Calculus II', requestDate: '2025-03-21T09:45:00', status: 'pending' }
  ]);
  
  const [courses, setCourses] = useState([
    { id: 1, courseCode: 'CS101', courseName: 'Introduction to Programming', schedule: 'Mon, Wed 10:00 AM', location: 'Room 101', studentsCount: 45, maxStudents: 50 },
    { id: 2, courseCode: 'CS202', courseName: 'Data Structures', schedule: 'Tue, Thu 9:00 AM', location: 'Lab 3', studentsCount: 32, maxStudents: 40 },
    { id: 3, courseCode: 'MATH201', courseName: 'Calculus II', schedule: 'Tue, Thu 11:00 AM', location: 'Room 204', studentsCount: 38, maxStudents: 45 }
  ]);
  
  const [stats, setStats] = useState({
    totalCourses: 3,
    totalStudents: 115,
    pendingRequests: 3,
    averageAttendance: 87
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleApproveRequest = (requestId) => {
    setEnrollmentRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'approved' } : req));
    
    setStats(prev => ({
      ...prev,
      pendingRequests: prev.pendingRequests - 1,
      totalStudents: prev.totalStudents + 1
    }));

    const request = enrollmentRequests.find(req => req.id === requestId);
    if (request) {
      setCourses(prev => prev.map(course => 
        course.courseCode === request.courseCode 
          ? { ...course, studentsCount: course.studentsCount + 1 } 
          : course
      ));
    }
  };

  const handleRejectRequest = (requestId) => {
    setEnrollmentRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'rejected' } : req));

    setStats(prev => ({
      ...prev,
      pendingRequests: prev.pendingRequests - 1
    }));
  };

  return (
    <DashboardLayout role="teacher">
      <div className="teacher-dashboard">
        <h1 className="dashboard-title">Teacher Dashboard</h1>
        
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon"><FaBook /></div>
            <div className="stat-content">
              <h3>{stats.totalCourses}</h3>
              <p>Active Courses</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><FaUserGraduate /></div>
            <div className="stat-content">
              <h3>{stats.totalStudents}</h3>
              <p>Total Students</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><FaCalendarAlt /></div>
            <div className="stat-content">
              <h3>{stats.averageAttendance}%</h3>
              <p>Avg. Attendance</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><FaTimesCircle /></div>
            <div className="stat-content">
              <h3>{stats.pendingRequests}</h3>
              <p>Pending Requests</p>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Enrollment Requests ({stats.pendingRequests})</h2>
          <div className="requests-container">
            {enrollmentRequests.map(request => (
              <div key={request.id} className={`request-card ${request.status !== 'pending' ? `request-${request.status}` : ''}`}>
                <div className="request-header">
                  <h3>{request.studentName}</h3>
                  <span className="student-id">{request.studentId}</span>
                </div>
                <div className="request-details">
                  <p><strong>Course:</strong> {request.courseName} ({request.courseCode})</p>
                  <p><strong>Requested:</strong> {formatDate(request.requestDate)}</p>
                </div>
                {request.status === 'pending' ? (
                  <div className="request-actions">
                    <button className="approve-btn" onClick={() => handleApproveRequest(request.id)}>
                      <FaCheckCircle /> Approve
                    </button>
                    <button className="reject-btn" onClick={() => handleRejectRequest(request.id)}>
                      <FaTimesCircle /> Reject
                    </button>
                  </div>
                ) : (
                  <div className="request-status">
                    {request.status === 'approved' ? <><FaCheckCircle /> Approved</> : <><FaTimesCircle /> Rejected</>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Your Courses</h2>
          <div className="courses-container">
            {courses.map(course => (
              <div key={course.id} className="course-card">
                <h3>{course.courseName}</h3>
                <div className="course-code">{course.courseCode}</div>
                <div className="course-details">
                  <p><strong>Schedule:</strong> {course.schedule}</p>
                  <p><strong>Location:</strong> {course.location}</p>
                  <div className="enrollment-status">
                    <div className="enrollment-bar">
                      <div className="enrollment-filled" style={{ width: `${(course.studentsCount / course.maxStudents) * 100}%` }}></div>
                    </div>
                    <p>{course.studentsCount}/{course.maxStudents} Students</p>
                  </div>
                </div>
                <button className="view-course-btn">View Details</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
