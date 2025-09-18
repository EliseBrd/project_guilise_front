import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/variables.scss";
import Register from "./pages/Register";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/register" element={<Register />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
