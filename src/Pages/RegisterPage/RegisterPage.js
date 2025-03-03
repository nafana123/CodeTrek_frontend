import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { AiFillLock } from 'react-icons/ai';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { Message } from 'primereact/message';

import axiosInstance from '../../axiosInstance';
import './RegisterPage.css';

const RegisterPage = ({ setUser }) => {
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        let errors = {};
        if (!login) errors.login = 'Поле логи обязательно для заполнения';
        if (!email) errors.email = 'Поле email обязательно для заполнения';
        if (!password) errors.password = 'Поле пароль обязательно для заполнения';
        else if (password.length < 6) errors.password = 'Пароль должен быть не менее 6 символов';
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
            const response = await axiosInstance.post('/register', { login, email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            const user = jwtDecode(token);
            setUser(user);
            navigate('/dashboard');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setErrors({ email: 'Пользователь с таким email уже существует' });
            } else {
                setErrors({ general: 'Ошибка регистрации. Попробуйте снова' });
            }
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
                        className={`input-field ${errors.login ? 'p-invalid' : ''}`}
                        placeholder="Логин"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                    {errors.login && <small className="error-message">{errors.login}</small>}
                    <InputText
                        type="email"
                        className={`input-field ${errors.email ? 'p-invalid' : ''}`}
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <small className="error-message">{errors.email}</small>}
                    <div className="password-container">
                        <InputText
                            type={showPassword ? 'text' : 'password'}
                            className={`input-field ${errors.password ? 'p-invalid' : ''}`}
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="button"
                            icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                    {errors.password && <small className="error-message">{errors.password}</small>}
                    <Button type="submit" className="pButton pButtonSecondarys">Зарегистрироваться</Button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
