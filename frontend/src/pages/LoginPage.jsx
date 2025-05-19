import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuthStore } from '../stores/authStore';

const LoginPage = () => {
  const { isAuthenticated } = useAuthStore();
  
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