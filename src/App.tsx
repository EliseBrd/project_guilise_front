import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/variables.scss";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard.tsx";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
