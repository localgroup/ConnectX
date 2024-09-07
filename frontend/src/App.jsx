import react from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import './index.css';
import ProtectedRoute from "./components/ProtectedRoute"


function App() {
  return (
    <>  

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element=
              <ProtectedRoute>
                <Home />
              </ProtectedRoute> />
          </Routes>
          
        </BrowserRouter>
    </>
  )
}

export default App
