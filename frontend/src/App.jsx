import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import './index.css';
import ProtectedRoute from "./components/ProtectedRoute"


function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
};


function App() {
  return (
    <>  

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/home" element=
              <ProtectedRoute>
                <Home />
              </ProtectedRoute> />
            <Route path="/user/profile/" element=
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute> />
          </Routes>
          
        </BrowserRouter>
    </>
  )
}

export default App
