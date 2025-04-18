import React from 'react';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = ({ user, setUser }) => {
    const isAdmin = () => user?.roles?.includes('ROLE_ADMIN');

    return (
        <header className="header">
            {user ? (
                isAdmin() ? (
                    <Link to="/admin">Админ панель</Link>
                ) : (
                    <a href="#new">Фича</a>
                )
            ) : (
                <nav className="navLinks">
                    <Link to="/"></Link>
                    <a href="#new"></a>
                    <a href="#about"></a>
                </nav>
            )}
            <div className="authButtons">
                {user ? (
                    <>
                        {!isAdmin() && (
                            <Link to="/profile">
                                <Button label='Профиль' icon='pi pi-user' className="pButton pButtonPrimary" />
                            </Link>
                        )}
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