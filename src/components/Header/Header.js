import React from 'react';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <nav className="navLinks">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#new">New</a>
            </nav>
            <div className="authButtons">
                <Button label="Зарегистрироваться" className="pButton pButtonPrimary" />
                <Button label="Войти" className="pButton pButtonSecondary" />
            </div>
        </header>
    );
};

export default Header;
