import react from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Welcome from "./pages/Welcome"
import ProtectedRoute from "./components/ProtectedRoute"


function App() {
  return (
    <>  

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
