import React from 'react';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = ({ user, setUser }) => {
    return (
        <header className="header">
            {user ? (
                <a href="#new">Фича</a>
            ) : (
                <nav className="navLinks">
                    <Link to="/">Главная</Link>
                    <a href="#new">Новости</a>
                    <a href="#about">О нас</a>
                </nav>
            )}
            <div className="authButtons">
                {user ? (
                    <>
                        <Button
                            label='Профиль'
                            icon='pi pi-user'
                            className="pButton pButtonPrimary"
                        />
                        <Button
                            label="Выйти"
                            icon='pi pi-sign-out'
                            className="pButton pButtonSecondary"
                            onClick={() => {
                                localStorage.removeItem('token');
                                setUser(null);
                            }}
                        />
                    </>
                ) : (
                    <>
                        <Link to="/register">
                            <Button label="Зарегистрироваться" className="pButton pButtonPrimary" />
                        </Link>
                        <Link to="/login">
                            <Button label="Войти" className="pButton pButtonSecondary" />
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;