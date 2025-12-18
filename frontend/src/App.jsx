import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import EditorPage from './pages/EditorPage';
import DashboardPage from './pages/DashboardPage';


function AppRouter() {
  
  const [page, setPage] = useState('home');
  const [roomId, setRoomId] = useState('');
  
  const { isAuthenticated, user, loading } = useAuth();

  const navigateTo = (targetPage, targetRoomId = '') => {
    setPage(targetPage);
    setRoomId(targetRoomId);
  };

  if (loading) {
    return <div className="page-container" style={{justifyContent: 'center'}}>Loading...</div>;
  }


  const renderPage = () => {

    if (page === 'editor' && roomId && isAuthenticated) {
      return <EditorPage roomId={roomId} navigateTo={navigateTo} />;
    }
    if (page === 'dashboard' && isAuthenticated && user?.role === 'TA') {
      return <DashboardPage navigateTo={navigateTo} />;
    }
    if (page === 'auth') {
      return <AuthPage navigateTo={navigateTo} />;
    }

    return <HomePage navigateTo={navigateTo} />;
    
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

