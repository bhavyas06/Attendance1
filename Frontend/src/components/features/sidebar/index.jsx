import React, { useState, useEffect } from 'react';
import { 
  FaBookOpen, FaClipboardList, FaChartBar, 
  FaStickyNote, FaBullhorn, FaCog, 
  FaUserGraduate, FaAngleLeft, FaAngleRight,
  FaTachometerAlt
} from 'react-icons/fa';
import './index.css';
import { useTheme } from '../theme';

const Sidebar = ({ 
  role = 'student',
  onMenuItemClick,
  activePage = 'dashboard'
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();

  // Handle window resize to collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Define menu items based on role
  const teacherMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'courses', label: 'Courses', icon: <FaBookOpen /> },
    { id: 'attendance', label: 'Attendance', icon: <FaClipboardList /> },
    { id: 'reports', label: 'Reports', icon: <FaChartBar /> },
    { id: 'notes', label: 'Notes', icon: <FaStickyNote /> },
    { id: 'announcements', label: 'Announcements', icon: <FaBullhorn /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> }
  ];

  const studentMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaUserGraduate /> },
    { id: 'attendance', label: 'Attendance', icon: <FaClipboardList /> },
    { id: 'reports', label: 'Reports', icon: <FaChartBar /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> }
  ];

  const menuItems = role === 'teacher' ? teacherMenuItems : studentMenuItems;

  const handleItemClick = (pageId) => {
    if (onMenuItemClick) {
      onMenuItemClick(pageId);
    }
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${theme === 'dark' ? 'sidebar-dark' : 'sidebar-light'}`}>
      <div className="sidebar-header">
        {!collapsed && <h2 className="sidebar-title">Attendance App</h2>}
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {collapsed ? <FaAngleRight /> : <FaAngleLeft />}
        </button>
      </div>
      
      <div className="sidebar-role">
        {!collapsed && <span>{role === 'teacher' ? 'Teacher' : 'Student'}</span>}
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button 
                onClick={() => handleItemClick(item.id)}
                className={`sidebar-link ${activePage === item.id ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {!collapsed && <span className="sidebar-label">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;