import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCamera, FaDownload, FaCalendarAlt, FaUserAlt, FaChartBar } from 'react-icons/fa';
import './index.css';
import { useTheme } from '../theme';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sections');
  const { theme } = useTheme();

  useEffect(() => {
    // Fetch course details from API
    // This is a mock implementation
    const fetchCourseDetails = async () => {
      try {
        // Replace with actual API call
        setTimeout(() => {
          const mockCourse = {
            id: courseId,
            code: 'CSE101',
            name: 'Introduction to Computer Science',
            description: 'An introductory course to the fundamentals of computer science.',
            students: 45,
            sections: 2,
            attendanceRate: 87,
          };
          
          const mockSections = [
            { id: 1, name: 'Section A', schedule: 'Mon, Wed 10:00-11:30', students: 25, attendanceRate: 92 },
            { id: 2, name: 'Section B', schedule: 'Tue, Thu 13:00-14:30', students: 20, attendanceRate: 81 },
          ];
          
          setCourse(mockCourse);
          setSections(mockSections);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Failed to fetch course details:", error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  return (
    <div className="course-detail-container">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading course details...</p>
        </div>
      ) : course ? (
        <>
          <div className="course-detail-header">
            <Link to="/dashboard/courses" className="back-button">
              <FaArrowLeft /> Back to Courses
            </Link>
            <div className="course-actions">
              <button className="btn-secondary take-attendance-btn">
                <FaCamera /> Take Attendance
              </button>
              <button className="btn-primary export-btn">
                <FaDownload /> Export Data
              </button>
            </div>
          </div>

          <div className="course-detail-info card">
            <div className="course-detail-title">
              <h2>{course.code}: {course.name}</h2>
            </div>
            <p className="course-description">{course.description}</p>
            <div className="course-stats-row">
              <div className="stat-box">
                <FaUserAlt className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">{course.students}</span>
                  <span className="stat-label">Students</span>
                </div>
              </div>
              <div className="stat-box">
                <FaCalendarAlt className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">{course.sections}</span>
                  <span className="stat-label">Sections</span>
                </div>
              </div>
              <div className="stat-box">
                <FaChartBar className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">{course.attendanceRate}%</span>
                  <span className="stat-label">Attendance</span>
                </div>
              </div>
            </div>
          </div>

          <div className="course-detail-tabs">
            <button 
              className={`tab ${activeTab === 'sections' ? 'active' : ''}`}
              onClick={() => setActiveTab('sections')}
            >
              Sections
            </button>
            <button 
              className={`tab ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              Students
            </button>
            <button 
              className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              Attendance Records
            </button>
          </div>

          {activeTab === 'sections' && (
            <div className="sections-container">
              {sections.map(section => (
                <Link to={`/dashboard/courses/${courseId}/section/${section.id}`} key={section.id} className="section-card card">
                  <h3 className="section-name">{section.name}</h3>
                  <p className="section-schedule">{section.schedule}</p>
                  <div className="section-stats">
                    <div className="stat">
                      <span className="stat-value">{section.students}</span>
                      <span className="stat-label">Students</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{section.attendanceRate}%</span>
                      <span className="stat-label">Attendance</span>
                    </div>
                  </div>
                  <button className="btn-primary section-attendance-btn">
                    <FaCamera /> Take Attendance
                  </button>
                </Link>
              ))}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="students-list card">
              <p>Student list will be displayed here...</p>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="attendance-records card">
              <p>Attendance records will be displayed here...</p>
            </div>
          )}
        </>
      ) : (
        <div className="not-found">
          <h2>Course not found</h2>
          <Link to="/dashboard/courses" className="btn-primary">
            Back to Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;