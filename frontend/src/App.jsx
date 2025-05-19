import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import PostDetailPage from './pages/PostDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { PostProvider } from './contexts/PostContext';

function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="posts/:id" element={<PostDetailPage />} />
            <Route 
              path="create" 
              element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="posts/:id/edit" 
              element={
                <ProtectedRoute>
                  <EditPostPage />
                </ProtectedRoute>
              } 
            />
            <Route path="profile/:userId" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </PostProvider>
    </AuthProvider>
  );
}

export default App;