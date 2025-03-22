import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCamera, FaCheck, FaTimes, FaSpinner, FaRedo, FaSave } from 'react-icons/fa';
import './index.css';
import { useTheme } from '../theme';

const TakeAttendance = () => {
  const { courseId, sectionId } = useParams();
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [recognitionResults, setRecognitionResults] = useState([]);
  const [saveStatus, setSaveStatus] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Fetch students and initialize attendance data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Replace with actual API call
        setTimeout(() => {
          const mockStudents = [
            { id: 1, name: 'Alice Johnson', rollNumber: 'CSE101-001', imageUrl: '/api/placeholder/100/100' },
            { id: 2, name: 'Bob Smith', rollNumber: 'CSE101-002', imageUrl: '/api/placeholder/100/100' },
            { id: 3, name: 'Charlie Davis', rollNumber: 'CSE101-003', imageUrl: '/api/placeholder/100/100' },
            { id: 4, name: 'Diana Miller', rollNumber: 'CSE101-004', imageUrl: '/api/placeholder/100/100' },
            { id: 5, name: 'Edward Wilson', rollNumber: 'CSE101-005', imageUrl: '/api/placeholder/100/100' },
            { id: 6, name: 'Fiona Brown', rollNumber: 'CSE101-006', imageUrl: '/api/placeholder/100/100' },
            { id: 7, name: 'George Taylor', rollNumber: 'CSE101-007', imageUrl: '/api/placeholder/100/100' },
            { id: 8, name: 'Hannah Lewis', rollNumber: 'CSE101-008', imageUrl: '/api/placeholder/100/100' },
          ];
          
          setStudents(mockStudents);
          
          // Initialize attendance data
          const initialAttendance = {};
          mockStudents.forEach(student => {
            initialAttendance[student.id] = { status: null, method: null }; // null = not marked yet
          });
          
          setAttendanceData(initialAttendance);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId, sectionId]);

  // Handle camera access
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check camera permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Simulate face recognition
  const recognizeFaces = () => {
    setRecognizing(true);
    
    // Simulate API call for face recognition
    setTimeout(() => {
      // Mock recognition results - in a real app, this would come from your backend
      const recognized = [1, 3, 5, 7]; // IDs of recognized students
      
      // Update attendance data for recognized students
      const updatedAttendance = { ...attendanceData };
      recognized.forEach(studentId => {
        updatedAttendance[studentId] = { status: 'present', method: 'auto' };
      });
      
      setAttendanceData(updatedAttendance);
      setRecognitionResults(recognized);
      setRecognizing(false);
    }, 3000);
  };

  // Manually mark attendance
  const markAttendance = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { status, method: 'manual' }
    }));
  };

  // Save attendance data
  const saveAttendance = async () => {
    setSaveStatus('saving');
    
    // Check if all students have been marked
    const unmarkedStudents = Object.keys(attendanceData).filter(
      id => attendanceData[id].status === null
    );
    
    if (unmarkedStudents.length > 0) {
      if (!window.confirm(`${unmarkedStudents.length} students are not marked. Mark them as absent?`)) {
        setSaveStatus(null);
        return;
      }
      
      // Mark remaining students as absent
      const finalAttendance = { ...attendanceData };
      unmarkedStudents.forEach(id => {
        finalAttendance[id] = { status: 'absent', method: 'manual' };
      });
      setAttendanceData(finalAttendance);
    }
    
    // Simulate API call to save attendance
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSaveStatus('success');
      // Navigate back after short delay
      setTimeout(() => {
        navigate(`/dashboard/courses/${courseId}/section/${sectionId}`);
      }, 1500);
    } catch (error) {
      console.error("Failed to save attendance:", error);
      setSaveStatus('error');
    }
  };

  return (
    <div className="take-attendance-container">
      <div className="take-attendance-header">
        <h1>Take Attendance</h1>
        <div className="date-container">
          <p>Date: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading students...</p>
        </div>
      ) : (
        <>
          <div className="attendance-camera-section card">
            <h2>Facial Recognition</h2>
            
            <div className="camera-container">
              {cameraActive ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  className="camera-feed"
                ></video>
              ) : (
                <div className="camera-placeholder">
                  <FaCamera size={48} />
                  <p>Camera is not active</p>
                </div>
              )}
            </div>
            
            <div className="camera-controls">
              {!cameraActive ? (
                <button className="btn-primary" onClick={startCamera}>
                  <FaCamera /> Start Camera
                </button>
              ) : (
                <>
                  <button 
                    className="btn-primary" 
                    onClick={recognizeFaces} 
                    disabled={recognizing}
                  >
                    {recognizing ? <><FaSpinner className="spinner" /> Recognizing...</> : 'Recognize Faces'}
                  </button>
                  <button className="btn-secondary" onClick={stopCamera}>
                    <FaTimes /> Stop Camera
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="attendance-list-section card">
            <h2>Student Attendance</h2>
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Roll No.</th>
                  <th>Name</th>
                  <th>Photo</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.rollNumber}</td>
                    <td>{student.name}</td>
                    <td>
                      <img 
                        src={student.imageUrl} 
                        alt={student.name} 
                        className="student-thumbnail"
                      />
                    </td>
                    <td>
                      <div className={`attendance-status ${attendanceData[student.id]?.status || 'unmarked'}`}>
                        {attendanceData[student.id]?.status === 'present' && 'Present'}
                        {attendanceData[student.id]?.status === 'absent' && 'Absent'}
                        {attendanceData[student.id]?.status === null && 'Not Marked'}
                        {attendanceData[student.id]?.method === 'auto' && ' (Auto)'}
                      </div>
                    </td>
                    <td>
                      <div className="attendance-actions">
                        <button 
                          className={`btn-action present ${attendanceData[student.id]?.status === 'present' ? 'active' : ''}`}
                          onClick={() => markAttendance(student.id, 'present')}
                          title="Mark Present"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          className={`btn-action absent ${attendanceData[student.id]?.status === 'absent' ? 'active' : ''}`}
                          onClick={() => markAttendance(student.id, 'absent')}
                          title="Mark Absent"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="attendance-save-section">
            <button 
              className="btn-secondary"
              onClick={() => navigate(`/dashboard/courses/${courseId}/section/${sectionId}`)}
            >
              Cancel
            </button>
            <button 
              className="btn-primary save-attendance-btn"
              onClick={saveAttendance}
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? (
                <><FaSpinner className="spinner" /> Saving...</>
              ) : saveStatus === 'success' ? (
                <><FaCheck /> Saved</>
              ) : (
                <><FaSave /> Save Attendance</>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TakeAttendance;