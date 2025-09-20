import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (!auth) return;
        await auth.logout();   // Appelle l’API Symfony et supprime user
        navigate("/login");    // Redirection vers login
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Bienvenue {auth?.user?.email}</p>
            <button onClick={handleLogout}>Déconnexion</button>
        </div>
    );
}
