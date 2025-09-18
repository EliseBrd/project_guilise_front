import {useState} from "react";
import "./Register.scss";
import {useNavigate} from "react-router-dom";
import Logo from "../assets/logo.svg";
import EyeOpen from "../assets/eye.svg";
import EyeClosed from "../assets/eye-closed.svg";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Lorsqu’on tape dans le mot de passe
    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        const inputChaine = e.target.value;
        setPassword(inputChaine);
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        console.log("Formulaire envoyé :", {email, password});
        // TODO: appeler le backend pour envoyer la connexion
    }

    return (
        <div className="registerContainer">
            <div className="left">
                <img className="logoApp" src={Logo} alt="Logo"/>
                <p className="slogan">Protecting access, securing trust</p>
            </div>
            <div className="right">
                <h2>Log in an account</h2>
                <div className="alreadyAccount">
                    <p>You do not have an account ?</p>
                    <a className="link" onClick={() => navigate("/register")}>Register</a>
                </div>
                <form onSubmit={handleSubmit}>
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
                    </div>


                    <button className="btnSubmit" type="submit">Create account</button>
                </form>
            </div>
        </div>
    );
}
