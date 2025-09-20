import { useState } from "react";
import "./Register.scss";
import Logo from "../assets/logo.svg";

export default function Register() {
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [entropy, setEntropy] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Lorsqu’on tape dans le mot de passe
    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        const inputChaine = e.target.value;
        setPassword(inputChaine);
        setEntropy(calculerEntropie(inputChaine)); // Décommenter si tu veux calculer l'entropie
    }

    // Fonction pour calculer l'entropie
    function calculerEntropie(chaine: string): number {
        if (!chaine || chaine.length === 0) {
            console.log('⚠ Erreur : La chaîne est vide !');
            return 0;
        }

        const longueur = chaine.length;
        const frequence = new Map(); // pour stocker les fréquences d’apparition des caractères

        // Compter combien de fois chaque caractère apparaît
        for (const c of chaine) {
            frequence.set(c, (frequence.get(c) || 0) + 1);
        }

        // Calcul de l'entropie
        let entropie = 0;
        for (const [, count] of frequence) { // pour chaque caractère du map
            const p = count / longueur; // probabilité p du caractère, Exemple : "l" apparaît 2 fois dans 5 caractères → p = 2/5 = 0.4
            entropie += -p * Math.log2(p); // formule mathématique de Shannon & "-p" car On corrige le signe du log (pour que ce soit positif).
        }

        return entropie; // valeur en bits qui représente la quantité d’information : bits/caractère
    }

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

    return (
        <div className="registerContainer">
            <div className="left">
                <img className="logoApp" src={Logo} alt="Logo" />
                <p className="slogan">Protecting access, securing trust</p>
            </div>
            <div className="right">
                <h2>Create an account</h2>
                <div>
                    <p>Already have an account ?</p>
                    <button>Login</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <div className="inputFirstname">
                            <label>Nom</label>
                            <input
                                type="text"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                required
                            />
                        </div>
                        <div className="inputLastname">
                            <label>Prénom</label>
                            <input
                                type="text"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="inputMail">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Mot de passe :</label>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        {entropy !== null && (
                            <p>🔑 Entropie : {entropy.toFixed(2)} bits</p>
                        )}
                    </div>

                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>{success}</p>}

                    <button type="submit">S'inscrire</button>
                </form>
            </div>
        </div>
    );
}
