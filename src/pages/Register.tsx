import {useContext, useEffect, useState} from "react";
import "./Register.scss";
import {AuthContext } from "../Provider/AuthProvider";
import Logo from "../assets/logo.svg";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import EyeOpen from "../assets/eye.svg";
import EyeClosed from "../assets/eye-closed.svg";


export default function Register() {
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [entropy, setEntropy] = useState<number | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [, setSuccess] = useState("");

    const auth = useContext(AuthContext);


    // Fonction pour calculer l'entropie
    function calculerEntropie(chaine: string): number {
        if (!chaine || chaine.length === 0) {
            console.log('⚠ Erreur : La chaîne est vide !');
            return 0;
        }

        // 1️⃣ Taille de l'alphabet selon types de caractères
        let alphabetSize = 0;
        if (/[a-z]/.test(chaine)) alphabetSize += 26; // minuscules
        if (/[A-Z]/.test(chaine)) alphabetSize += 26; // majuscules
        if (/[0-9]/.test(chaine)) alphabetSize += 10; // chiffres
        if (/[^a-zA-Z0-9]/.test(chaine)) alphabetSize += 33; // spéciaux

        const longueur = chaine.length;

        // 2️⃣ Entropie théorique (bits)
        let entropy = Math.log2(Math.pow(alphabetSize, longueur));

        // 3️⃣ Pénalisation pour répétitions
        const uniqueChars = new Set(chaine).size;
        if (uniqueChars < longueur) {
            const repetitionPenalty = longueur / uniqueChars; // plus c'est répétitif, plus la pénalité
            entropy /= repetitionPenalty;
        }

        return entropy;
    }

    // Lorsqu’on tape dans le mot de passe
    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        const inputChaine = e.target.value;
        setPassword(inputChaine);
        setEntropy(calculerEntropie(inputChaine));
    }

    useEffect(() => {
        if (!auth?.loading && auth?.user) {
            navigate("/dashboard");
        }
    }, [auth?.loading, auth?.user, navigate]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (entropy !== null && entropy < 2) {
            setError("❌ Mot de passe trop faible !");
            return;
        }

        setError("");
        setSuccess("");

        try {
            const response = await fetch("http://localhost:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Host': 'localhost:8000',
                },
                body: JSON.stringify({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de l'inscription");
            }

            const data = await response.json();
            console.log("Réponse API:", data);
            setSuccess("✅ Compte créé avec succès !");
            setLastname("");
            setFirstname("");
            setEmail("");
            setPassword("");
        } catch (err: any) {
            console.error("Erreur API:", err);
            setError(err.message || "Une erreur est survenue.");
        }
    }

    function getPasswordStrength(entropy: number): { level: string, color: string } {
        if (entropy < 28) return {level: "Faible", color: "red"};        // < 2^28 combinaisons ≈ faible
        if (entropy < 36) return {level: "Moyen", color: "orange"};      // < 2^36 combinaisons ≈ moyenne
        if (entropy < 60) return {level: "Bon", color: "green"};         // < 2^60 combinaisons ≈ bonne
        return {level: "Excellent", color: "darkgreen"};                // ≥ 2^60 combinaisons ≈ très forte
    }

    const fadeSlideLeft = {
        hidden: { opacity: 0, x: -20 }, // départ à gauche et invisible
        visible: { opacity: 1, x: 0, transition: { duration: 1 } }, // arrive à sa position
    };

    const fadeSlideRight = {
        hidden: { opacity: 0, x: 20 }, // départ à droite et invisible
        visible: { opacity: 1, x: 0, transition: { duration: 1 } },
    };

    return (
        <motion.div
            className="registerContainer"
            initial="hidden"
            animate="visible"
        >
            <motion.div className="left" variants={fadeSlideLeft}>
                <img className="logoApp" src={Logo} alt="Logo"/>
                <p className="slogan">Protecting access, securing trust</p>
            </motion.div>
            <motion.div className="right" variants={fadeSlideRight}>
                <h2>Create an account</h2>
                <div className="alreadyAccount">
                    <p>Already have an account ?</p>
                    <a className="link" onClick={() => navigate("/login")}>Log in</a>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="nameFields">
                        <input
                            className="inputFirstname"
                            placeholder="Lastname"
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                        />
                        <input
                            className="inputLastname"
                            placeholder="Firstname"
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                    </div>
                    <div className="inputMail">
                        <input
                            className="email"
                            placeholder="Email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="passwordField">
                        <div className="passwordInput">
                            <input
                                className="password"
                                placeholder="Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />

                            <img
                                src={showPassword ? EyeOpen : EyeClosed}
                                alt="Toggle password visibility"
                                className="eye-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>

                    {error && <p style={{color: "red"}}>{error}</p>}

                        {entropy !== null && (
                            <div className="strengthMeter">
                                <div
                                    className="strengthBar"
                                    style={{
                                        width: `${Math.min((entropy / 70) * 100, 100)}%`,
                                        backgroundColor: getPasswordStrength(entropy).color,
                                    }}
                                />
                            </div>
                        )}

                        {entropy !== null && (
                            <p className="strengthLabel">{getPasswordStrength(entropy).level}</p>
                        )}
                    </div>


                    <button className="btnSubmit" type="submit">Create account</button>
                </form>
            </motion.div>
        </motion.div>
    );
}
