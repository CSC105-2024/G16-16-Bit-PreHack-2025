import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuthStore } from '../stores/authStore';

const RegisterPage = () => {
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    document.title = 'Create Account - Pinpoint';
  }, []);
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="py-10">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;