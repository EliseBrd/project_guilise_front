import {useState} from "react";
import "./Register.scss";
import Logo from "../assets/logo.svg";
import EyeOpen from "../assets/eye.svg";
import EyeClosed from "../assets/eye-closed.svg";

export default function Register() {
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [entropy, setEntropy] = useState<number | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Fonction pour calculer l'entropie
    function calculerEntropie(chaine: string): number {
        if (!chaine || chaine.length === 0) {
            console.log('⚠ Erreur : La chaîne est vide !');
            return 0;
        }

        const longueur = chaine.length;
        const frequence = new Map(); // pour stocker les fréquences d’apparition des caractères

        // Compter combien de fois chaque caractère apparaît
        for (let c of chaine) {
            frequence.set(c, (frequence.get(c) || 0) + 1);
        }

        // Calcul de l'entropie
        let entropie = 0;
        for (let [, count] of frequence) { // pour chaque caractère du map
            let p = count / longueur; // probabilité p du caractère, Exemple : "l" apparaît 2 fois dans 5 caractères → p = 2/5 = 0.4
            entropie += -p * Math.log2(p); // formule mathématique de Shannon & "-p" car On corrige le signe du log (pour que ce soit positif).
        }

        return entropie; // valeur en bits qui représente la quantité d’information : bits/caractère
    }

    // Lorsqu’on tape dans le mot de passe
    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        const inputChaine = e.target.value;
        setPassword(inputChaine);
        setEntropy(calculerEntropie(inputChaine));
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        console.log("Formulaire envoyé :", {email, password});
        // TODO: appeler le backend pour envoyer l'inscription
    }

    function getPasswordStrength(entropy: number): { level: string, color: string } {
        if (entropy < 2) return {level: "Faible", color: "red"};
        if (entropy < 3.5) return {level: "Moyen", color: "orange"};
        if (entropy < 4.5) return {level: "Bon", color: "green"};
        return {level: "Excellent", color: "darkgreen"};
    }

    return (
        <div className="registerContainer">
            <div className="left">
                <img className="logoApp" src={Logo} alt="Logo"/>
                <p className="slogan">Protecting access, securing trust</p>
            </div>
            <div className="right">
                <h2>Create an account</h2>
                <div className="alreadyAccount">
                    <p>Already have an account ?</p>
                    <a className="link">Log in</a>
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


                        {entropy !== null && (
                            <div className="strengthMeter">
                                <div
                                    className="strengthBar"
                                    style={{
                                        width: `${Math.min(entropy * 20, 100)}%`, // entropie → %
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
            </div>
        </div>
    );
}
