import React, { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ViewPost from "./pages/ViewPost";
import Search from "./pages/Search";
import './index.css';
import ProtectedRoute from "./components/ProtectedRoute";
import EditProfile from "./pages/EditProfile";
import Following from "./pages/Following";
import Follower from "./pages/Follower";
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import Message from "./pages/Message";

function Logout() {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, []);
  return <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/posts" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/:username/update-profile/" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />          
          <Route path="/posts/:postId/" element={<ProtectedRoute><ViewPost /></ProtectedRoute>} />          
          <Route path="/:username/follower/" element={<ProtectedRoute><Follower /></ProtectedRoute>} />          
          <Route path="/:username/following/" element={<ProtectedRoute><Following /></ProtectedRoute>} />          
          <Route path="/search/" element={<ProtectedRoute><Search /></ProtectedRoute>} />          
          <Route path="/messages/" element={<ProtectedRoute><Message /></ProtectedRoute>} />          
          <Route path="/messages/:messageId/" element={<ProtectedRoute><Message /></ProtectedRoute>} />          

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App