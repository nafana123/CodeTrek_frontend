import React from 'react';
import { Button } from 'primereact/button';
import { jwtDecode } from 'jwt-decode';
import 'primeicons/primeicons.css';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    const token = localStorage.getItem('token');
    let user = null;

    if (token) {
        try {
            user = jwtDecode(token);
            console.log(user);
        } catch (error) {
            console.error('Недействительный токен:', error);
        }
    }

    return (
        <header className="header">
            <nav className="navLinks">
                <Link to="/">Главная</Link>


                <a href="#about">About</a>
                <a href="#new">New</a>
            </nav>
            <div className="authButtons">
                {user ? (
                    <>
                        <span>Добро пожаловать, {user.username}!</span>
                        <Button label="Выйти" className="pButton pButtonSecondary" onClick={() => {
                            localStorage.removeItem('token');
                            window.location.reload();
                        }} />
                    </>
                ) : (
                    <>
                        <Link to="/register">
                            <Button label="Зарегистрироваться" className="pButton pButtonPrimary" />
                        </Link>
                        <Link to={"/login"}>
                            <Button label="Войти" className="pButton pButtonSecondary" />
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
