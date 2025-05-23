import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { AiFillLock, AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

import axiosInstance from '../../axiosInstance';
import './RegisterPage.css';
import { Dialog } from "primereact/dialog";

const RegisterPage = ({ setUser }) => {
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [code, setCode] = useState(['', '', '', '', '']);
    const [showModal, setShowModal] = useState(false);

    const codeRefs = useRef([]);

    useEffect(() => {
        codeRefs.current = code.map((_, i) => codeRefs.current[i] ?? React.createRef());
    }, [code]);

    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!login) errors.login = 'Поле логин обязательно';
        if (!email) errors.email = 'Поле email обязательно';
        if (!password) errors.password = 'Поле пароль обязательно';
        else if (password.length < 6) errors.password = 'Пароль должен быть не менее 6 символов';
        return errors;
    };
    const handleStartRegister = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        try {
            const { data } = await axiosInstance.post('/check-email', { email });
            if (data.exists) {
                setErrors({ email: 'Пользователь с таким email уже существует' });
                return;
            }
            setShowModal(true);
            await axiosInstance.post('/confirm', { email });
        } catch (error) {
            setErrors({ general: 'Произошла ошибка. Попробуйте позже' });
        }
    };

    const handleCodeChange = (index, value) => {
        if (/^\d?$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value && index < 4 && codeRefs.current[index + 1]) {
                codeRefs.current[index + 1].current?.focus();
            }
        }
    };

    const handleRegister = async () => {
        try {
            const codeToSend = code.join('');
            const response = await axiosInstance.post('/register', { login, email, password, codeToSend });
            console.log(response)

            const { token } = response.data;
            localStorage.setItem('token', token);
            const user = jwtDecode(token);
            setUser(user);
            navigate('/dashboard');
        } catch (error) {
            if (error.response?.status === 400) {
                setErrors({ general: 'Неверный код подтверждения. Пожалуйста, попробуйте еще раз.' });
            } else if (error.response?.status === 409) {
                setErrors({ email: 'Пользователь с таким email уже существует' });
            } else {
                setErrors({ general: 'Ошибка регистрации. Попробуйте позже.' });
            }
        }
    };

    return (
        <div className="main-section">
            <div className="content">
                <AiFillLock className="lock-icon" />
                <h2>Регистрация</h2>
                <form onSubmit={handleStartRegister}>
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

            {showModal && (
                <Dialog
                    visible={showModal}
                    onHide={() => setShowModal(false)}
                    header={null}
                    closable={false}
                    className="custom-modal"
                    draggable={false}
                    modal
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Введите код</h3>
                            <AiOutlineClose className="close-icon" onClick={() => setShowModal(false)} />
                        </div>
                        <p className="modal-description">
                            Введите пятизначный код подтверждения из письма,<br />
                            отправленного на адрес <strong>{email}</strong>.
                        </p>
                        <div className="code-inputs">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`code-${index}`}
                                    className="code-input"
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    ref={codeRefs.current[index]}
                                />
                            ))}
                        </div>

                        {errors.general && <small className="error-messagess">{errors.general}</small>}

                        <Button label="Отправить" onClick={handleRegister} className="pButton pButtonSecondary" />
                    </div>
                </Dialog>
            )}
        </div>
    );
};

export default RegisterPage;
