import react from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import './index.css';
import ProtectedRoute from "./components/ProtectedRoute"


function App() {
  return (
    <>  

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          
        </BrowserRouter>
    </>
  )
}

export default App
