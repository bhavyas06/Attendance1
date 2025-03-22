import React, { useState } from 'react';
import { FaCalendarAlt, FaChartBar, FaCheckCircle, FaExclamationCircle, FaPlus, FaSearch } from 'react-icons/fa';
import "./index.css"

const StudentDashboard = () => {
  // In a real app, these would be fetched from an API
  const [attendanceStats, setAttendanceStats] = useState({
    present: 85,
    absent: 10, 
    late: 5,
    total: 100
  });
  
  const [upcomingClasses, setUpcomingClasses] = useState([
    { id: 1, subject: 'Mathematics', date: '2025-03-23', time: '09:00 AM', room: 'Room 101' },
    { id: 2, subject: 'Computer Science', date: '2025-03-23', time: '11:00 AM', room: 'Lab 3' },
    { id: 3, subject: 'Physics', date: '2025-03-24', time: '10:00 AM', room: 'Room 204' }
  ]);
  
  const [recentAttendance, setRecentAttendance] = useState([
    { id: 1, subject: 'Mathematics', date: '2025-03-21', status: 'present' },
    { id: 2, subject: 'Computer Science', date: '2025-03-21', status: 'present' },
    { id: 3, subject: 'Physics', date: '2025-03-20', status: 'absent' },
    { id: 4, subject: 'English', date: '2025-03-20', status: 'late' }
  ]);

  // New state for enrollment feature
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([
    { id: 1, courseCode: 'CS101', courseName: 'Introduction to Programming', instructor: 'Dr. Smith', schedule: 'Mon, Wed 10:00 AM', credits: 3 },
    { id: 2, courseCode: 'MATH201', courseName: 'Calculus II', instructor: 'Dr. Johnson', schedule: 'Tue, Thu 11:00 AM', credits: 4 },
    { id: 3, courseCode: 'PHYS101', courseName: 'Physics for Engineers', instructor: 'Prof. Williams', schedule: 'Mon, Wed, Fri 2:00 PM', credits: 4 },
    { id: 4, courseCode: 'ENG102', courseName: 'Technical Writing', instructor: 'Prof. Davis', schedule: 'Thu 1:00 PM', credits: 2 },
    { id: 5, courseCode: 'CS202', courseName: 'Data Structures', instructor: 'Dr. Garcia', schedule: 'Tue, Thu 9:00 AM', credits: 3 },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Filter courses based on search term
  const filteredCourses = availableCourses.filter(course => 
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle enrollment request
  const handleEnrollRequest = (course) => {
    // Check if already requested
    if (enrollmentRequests.some(req => req.courseId === course.id)) {
      return;
    }
    
    // In a real app, you would send this to your backend
    const newRequest = {
      id: Date.now(),
      courseId: course.id,
      courseCode: course.courseCode,
      courseName: course.courseName,
      requestDate: new Date().toISOString(),
      status: 'pending'
    };
    
    setEnrollmentRequests([...enrollmentRequests, newRequest]);
    setEnrollmentSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setEnrollmentSuccess(false);
    }, 3000);
  };

  return (
    <div className="student-dashboard">
      <div className="section-header">
        <h1 className="section-title">Student Dashboard</h1>
        <p className="section-subtitle">Welcome back! Here's your attendance overview</p>
      </div>
      
      {/* Attendance Stats */}
      <div className="grid-container">
        <div className="stat-card">
          <span className="stat-title">Present</span>
          <span className="stat-value stat-present">{attendanceStats.present}%</span>
          <div className="stat-icon present-icon">
            <FaCheckCircle />
          </div>
        </div>
        
        <div className="stat-card">
          <span className="stat-title">Absent</span>
          <span className="stat-value stat-absent">{attendanceStats.absent}%</span>
          <div className="stat-icon absent-icon">
            <FaExclamationCircle />
          </div>
        </div>
        
        <div className="stat-card">
          <span className="stat-title">Late</span>
          <span className="stat-value stat-late">{attendanceStats.late}%</span>
          <div className="stat-icon late-icon">
            <FaCalendarAlt />
          </div>
        </div>
        
        <div className="stat-card">
          <span className="stat-title">Classes Attended</span>
          <span className="stat-value">{Math.floor(attendanceStats.total * attendanceStats.present / 100)}/{attendanceStats.total}</span>
          <div className="stat-icon">
            <FaChartBar />
          </div>
        </div>
      </div>
      
      {/* Enrollment Button */}
      <div className="enroll-container">
        <button 
          className="enroll-button"
          onClick={() => setIsEnrollModalOpen(true)}
        >
          <FaPlus /> Enroll in New Course
        </button>
      </div>
      
      {/* Upcoming Classes and Recent Attendance */}
      <div className="dashboard-row">
        <div className="dashboard-card upcoming-classes">
          <div className="card-header">
            <h2 className="card-title">Upcoming Classes</h2>
          </div>
          
          <div className="upcoming-class-list">
            {upcomingClasses.map(course => (
              <div key={course.id} className="upcoming-class-item">
                <div className="class-subject">{course.subject}</div>
                <div className="class-details">
                  <span className="class-date">{formatDate(course.date)}</span>
                  <span className="class-time">{course.time}</span>
                  <span className="class-room">{course.room}</span>
                </div>
              </div>
            ))}
          </div>
          
          {upcomingClasses.length === 0 && (
            <p className="no-data">No upcoming classes today</p>
          )}
        </div>
        
        <div className="dashboard-card recent-attendance">
          <div className="card-header">
            <h2 className="card-title">Recent Attendance</h2>
          </div>
          
          <div className="recent-attendance-list">
            {recentAttendance.map(record => (
              <div key={record.id} className="attendance-record">
                <div className="attendance-subject">{record.subject}</div>
                <div className="attendance-details">
                  <span className="attendance-date">{formatDate(record.date)}</span>
                  <span className={`attendance-status status-${record.status}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {recentAttendance.length === 0 && (
            <p className="no-data">No recent attendance records</p>
          )}
        </div>
      </div>
      
      {/* Enrollment Requests Section */}
      {enrollmentRequests.length > 0 && (
        <div className="dashboard-card enrollment-requests">
          <div className="card-header">
            <h2 className="card-title">Course Enrollment Requests</h2>
          </div>
          
          <div className="enrollment-request-list">
            {enrollmentRequests.map(request => (
              <div key={request.id} className="enrollment-request-item">
                <div className="request-course">
                  <span className="course-code">{request.courseCode}</span>
                  <span className="course-name">{request.courseName}</span>
                </div>
                <div className="request-details">
                  <span className="request-date">{formatDate(request.requestDate)}</span>
                  <span className={`request-status status-${request.status}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Enrollment Modal */}
      {isEnrollModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Enroll in a Course</h2>
              <button 
                className="close-button"
                onClick={() => setIsEnrollModalOpen(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              {enrollmentSuccess && (
                <div className="success-message">
                  <FaCheckCircle /> Enrollment request submitted successfully!
                </div>
              )}
              
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input 
                  type="text"
                  placeholder="Search courses by code, name, or instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="courses-list">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map(course => (
                    <div key={course.id} className="course-item">
                      <div className="course-info">
                        <div className="course-header">
                          <span className="course-code">{course.courseCode}</span>
                          <span className="course-credits">{course.credits} Credits</span>
                        </div>
                        <h3 className="course-name">{course.courseName}</h3>
                        <div className="course-details">
                          <span className="course-instructor">{course.instructor}</span>
                          <span className="course-schedule">{course.schedule}</span>
                        </div>
                      </div>
                      <button 
                        className="enroll-request-button"
                        onClick={() => handleEnrollRequest(course)}
                        disabled={enrollmentRequests.some(req => req.courseId === course.id)}
                      >
                        {enrollmentRequests.some(req => req.courseId === course.id) 
                          ? 'Requested' 
                          : 'Enroll'}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-courses">No courses match your search criteria.</p>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-button"
                onClick={() => setIsEnrollModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;