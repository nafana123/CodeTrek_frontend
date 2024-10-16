import React, { useState } from "react";
import axiosInstance from '../../axiosInstance';
import { useNavigate } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './LoginPage.css';
import { AiFillLock } from "react-icons/ai";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axiosInstance.post('/login', {
                email,
                password,
            });
            const { token } = response.data;
            localStorage.setItem('token', token);
            navigate('/dashboard');
            window.location.reload();
        } catch (error) {
            alert('Ошибка входа');
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
                        className="input-field"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="password-container">
                        <InputText
                            type={passwordVisible ? 'text' : 'password'}
                            className="input-field"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            type="button"
                            icon={passwordVisible ? 'pi pi-eye-slash' : 'pi pi-eye'}
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="toggle-password"
                        />
                    </div>
                    <Button type="submit" className="pButton pButtonSecondarys">Войти</Button>
                </form>
                <p className="forgot-password">Забыли пароль?</p>
            </div>
        </div>
    );
};

export default LoginPage;
