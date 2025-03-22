

import './App.css'
import './components/auth/Signup'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [role, setRole] = useState('teacher'); // or 'student'
  const [userName, setUserName] = useState('John Doe');
  const [theme, setTheme] = useState('light');

  // Handler for sidebar menu clicks
  const handleMenuItemClick = (pageId) => {
    setCurrentPage(pageId);
  };

  // Handlers for navbar actions
  const handleProfileClick = () => {
    setCurrentPage('profile');
  };

  const handleSettingsClick = () => {
    setCurrentPage('settings');
  };

  const handleLogoutClick = () => {
    // Handle logout logic here
    console.log('Logging out...');
  };

  // Render the appropriate page based on currentPage state
  const renderPage = () => {
    if (role === 'teacher') {
      switch (currentPage) {
        case 'dashboard':
          return <Dashboard />;
        case 'courses':
          return <Courses />;
        case 'attendance':
          return <Attendance />;
        case 'reports':
          return <Reports />;
        case 'notes':
          return <Notes />;
        case 'announcements':
          return <Announcements />;
        case 'settings':
          return <Settings />;
        case 'profile':
          return <Profile userName={userName} />;
        default:
          return <Dashboard />;
      }
    } else {
      // Student role
      switch (currentPage) {
        case 'dashboard':
          return <StudentDashboard />;
        case 'attendance':
          return <Attendance />;
        case 'reports':
          return <Reports />;
        case 'settings':
          return <Settings />;
        case 'profile':
          return <Profile userName={userName} />;
        default:
          return <StudentDashboard />;
      }
    }
  };

  return (
    <div data-theme={theme} className="flex">
      <Sidebar 
        role={role} 
        onMenuItemClick={handleMenuItemClick}
        activePage={currentPage}
      />
      <div className="flex-1 p-4">
        <Navbar 
          userName={userName}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
          onLogoutClick={handleLogoutClick}
        />
        <ThemeToggle theme={theme} setTheme={setTheme} />
        {renderPage()}
      </div>
    </div>
  );

}

export default App;