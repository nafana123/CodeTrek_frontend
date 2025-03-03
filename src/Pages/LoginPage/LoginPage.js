import React, { useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./LoginPage.css";
import { AiFillLock } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";

const LoginPage = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        let errors = {};
        if (!email) {
            errors.email = "Поле email обязательно для заполнения";
        }
        if (!password) {
            errors.password = "Поле пароль обязательно для заполнения";
        }
        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        try {
            const response = await axiosInstance.post("/login", { email, password });
            const { token } = response.data;
            localStorage.setItem("token", token);
            const user = jwtDecode(token);
            setUser(user);
            if (user.roles.includes("ROLE_ADMIN")) {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            setErrors({ general: "Ошибка входа. Проверьте email и пароль" });
        }
    };

    return (
        <div className="main-section">
            <div className="content">
                <AiFillLock className="lock-icon" />
                <h2>Вход</h2>
                <form onSubmit={handleSubmit}>
                    <InputText
                        type="email"
                        className={`input-field ${errors.email ? "p-invalid" : ""}`}
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <small className="error-message">{errors.email}</small>}

                    <div className="password-container">
                        <InputText
                            type={passwordVisible ? "text" : "password"}
                            className={`input-field ${errors.password ? "p-invalid" : ""}`}
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="button"
                            icon={passwordVisible ? "pi pi-eye-slash" : "pi pi-eye"}
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="toggle-password"
                        />
                    </div>
                    {errors.password && <small className="error-message">{errors.password}</small>}

                    {errors.general && <small className="error-message">{errors.general}</small>}

                    <Button type="submit" className="pButton pButtonSecondarys">Войти</Button>
                </form>
                <p className="forgot-password">Забыли пароль?</p>
            </div>
        </div>
    );
};

export default LoginPage;
