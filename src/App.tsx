import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/variables.scss";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard.tsx";
import { useContext } from "react";
import { AuthContext } from "./Provider/AuthProvider.tsx";

function App() {
    const auth = useContext(AuthContext);

    if (!auth) return null;
    const { user, loading } = auth;

    if (loading) {
        return <div>Chargement...</div>;
    }
  return (
      <BrowserRouter>
          <Routes>
              {/* Route racine */}
              <Route path="/" element={
                  user ? <Navigate to="/dashboard" replace /> : <Navigate to="/register" replace />
              } />

              {/* Routes publiques */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              {/* Route protégée */}
              <Route
                  path="/dashboard"
                  element={user ? <Dashboard /> : <Navigate to="/login" replace />}
              />
          </Routes>
      </BrowserRouter>
  )
}

export default App;
