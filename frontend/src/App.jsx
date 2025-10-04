import { useState } from 'react';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

function AppRouter() {
  const [page, setPage] = useState('home');

  const navigateTo = (targetPage, targetRoomId = '') => {
    setPage(targetPage);
    setRoomId(targetRoomId);
  };

  if (loading) {
    return <div className="page-container" style={{justifyContent: 'center'}}>Loading...</div>;
  }

  // Render logic for our "pages"
  const renderPage = () => {
    
    if (page === 'dashboard' && isAuthenticated && user?.role === 'TA') {
      return <DashboardPage navigateTo={navigateTo} />;
    }
    if (page === 'auth') {
      return <AuthPage navigateTo={navigateTo} />;
    }
    
  };

  return (
    <div>
      {renderPage()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App;

