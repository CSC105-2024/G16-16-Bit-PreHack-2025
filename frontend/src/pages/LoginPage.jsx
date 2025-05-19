import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    document.title = 'Sign In - Pinpoint';
  }, []);
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="py-10">
      <LoginForm />
    </div>
  );
};

export default LoginPage;