import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider"; // ajuste le chemin si nécessaire
import { motion } from "framer-motion";
import Logo from "../assets/logo.svg";
import EyeOpen from "../assets/eye.svg";
import EyeClosed from "../assets/eye-closed.svg";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const auth = useContext(AuthContext);

    useEffect(() => {
        if (!auth?.loading && auth?.user) {
            navigate("/dashboard");
        }
    }, [auth?.loading, auth?.user, navigate]);

    async function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!auth) return;
            await auth.login(email, password);
            navigate("/dashboard");
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Erreur lors de la connexion");
        }
    };

    const fadeSlideLeft = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 1 } } };
    const fadeSlideRight = { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 1 } } };

    return (
        <motion.div className="registerContainer" initial="hidden" animate="visible">
            <motion.div className="left" variants={fadeSlideLeft}>
                <img className="logoApp" src={Logo} alt="Logo" />
                <p className="slogan">Protecting access, securing trust</p>
            </motion.div>
            <motion.div className="right" variants={fadeSlideRight}>
                <h2>Log in an account</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="passwordInput">
                        <input
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <img
                            src={showPassword ? EyeOpen : EyeClosed}
                            alt="Toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </motion.div>
        </motion.div>
    );
}
