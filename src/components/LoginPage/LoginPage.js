import React, {useState} from "react";
import axiosInstance from '../../axiosInstance';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try{
            const response = await axiosInstance.post('/login',{
                email,
                password,
            })
            const { token } = response.data;
            localStorage.setItem('token', token);
            navigate('/dashboard');
            window.location.reload();

        }
        catch (error) {
            alert('Ошибка регистрации');
        }
    };

    return (
        <div>
            <h2>Вход в аккаунт</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Войти</button>
            </form>
        </div>
    )
}

export default LoginPage;