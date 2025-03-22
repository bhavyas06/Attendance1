import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaFilter, FaEllipsisV } from 'react-icons/fa';
import './index.css';
import { useTheme } from "../theme";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();
  
  useEffect(() => {
    // Fetch courses from API
    // This is a mock implementation
    const fetchCourses = async () => {
      try {
        // Replace with actual API call
        setTimeout(() => {
          const mockCourses = [
            { id: 1, code: 'CSE101', name: 'Introduction to Computer Science', students: 45, sections: 2 },
            { id: 2, code: 'MTH201', name: 'Calculus II', students: 38, sections: 3 },
            { id: 3, code: 'PHY105', name: 'Physics for Engineers', students: 52, sections: 2 },
            { id: 4, code: 'ENG203', name: 'Technical Writing', students: 30, sections: 1 },
            { id: 5, code: 'CSE205', name: 'Data Structures and Algorithms', students: 42, sections: 2 },
          ];
          setCourses(mockCourses);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>My Courses</h1>
        <button className="btn-primary">
          <FaPlus /> Add New Course
        </button>
      </div>

      <div className="courses-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search courses..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn">
          <FaFilter /> Filter
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading courses...</p>
        </div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <Link to={`/dashboard/courses/${course.id}`} key={course.id} className="course-card card">
                <div className="course-card-header">
                  <h3 className="course-code">{course.code}</h3>
                  <button className="course-options-btn">
                    <FaEllipsisV />
                  </button>
                </div>
                <h2 className="course-name">{course.name}</h2>
                <div className="course-stats">
                  <div className="stat">
                    <span className="stat-value">{course.students}</span>
                    <span className="stat-label">Students</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{course.sections}</span>
                    <span className="stat-label">Sections</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-courses">
              <p>No courses match your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;