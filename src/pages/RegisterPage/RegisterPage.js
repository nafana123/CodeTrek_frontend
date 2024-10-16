import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { AiFillLock } from 'react-icons/ai';
import axiosInstance from '../../axiosInstance';
import './RegisterPage.css';

const RegisterPage = () => {
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/register', {
                login,
                email,
                password,
            });
            const { token } = response.data;
            localStorage.setItem('token', token);
            alert('Регистрация успешна!');
        } catch (error) {
            alert('Ошибка регистрации');
        }
    };

    return (
        <div className="main-section">
            <div className="content">
                <AiFillLock className="lock-icon" />
                <h2>Регистрация</h2>
                <form onSubmit={handleSubmit}>
                    <InputText
                        type="text"
                        className="input-field"
                        placeholder="Логин"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />
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
                            type={showPassword ? 'text' : 'password'}
                            className="input-field"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            type="button"
                            icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                    <Button type="submit" className="pButton pButtonSecondarys">Зарегистрироваться</Button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
