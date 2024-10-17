import React from 'react';
import { Button } from 'primereact/button';
import './MainPage.css';
import { Link } from "react-router-dom";

const MainPage = () => {
    const languages = [
        'JavaScript', 'Python', 'C++', 'Java', 'PHP', 'Ruby', 'Go', 'Kotlin', 'Swift', 'Rust', 'C#', 'TypeScript',
        'SQL', 'Scala', 'Perl', 'Lua', 'Haskell', 'Dart', 'Shell'
    ];

    const generateCodeLines = (count) => {
        const lines = [];
        for (let i = 0; i < count; i++) {
            const randomLanguage = languages[Math.floor(Math.random() * languages.length)];
            lines.push(`${randomLanguage}`);
        }
        return lines;
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <section className="main-section">
                <div className="content">
                    <h1>Добро пожаловать в CodeTrek</h1>
                    <p>Решай задачи, улучшай свои навыки и участвуй в соревнованиях</p>
                    <div className="buttons">
                        <Link to="/register">
                            <Button label="Начать" className="p-button-rounded p-button-primary p-button-lg" />
                        </Link>
                        <Button
                            label="Узнать больше"
                            className="p-button-rounded p-button-secondary p-button-lg ml-2"
                            onClick={() => scrollToSection('info-sections')}
                        />
                    </div>
                </div>
                <div className="code-rain">
                    {generateCodeLines(55).map((line, index) => (
                        <span key={index} style={{ animationDuration: `${Math.random() * 5 + 5}s`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}>
                            {line}
                        </span>
                    ))}
                </div>
            </section>

            <section id="info-sections" className="info-section">
                <div className="info-content" style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <i className="pi pi-check-circle" style={{ fontSize: '34px', color: '#3DFF00', marginRight: '25px', marginTop: '15px' }}></i>
                    <div>
                        <h2>Создавайте проекты</h2>
                        <p>Применяйте свои знания на практике<br /> создавая проекты и улучшая свои навыки<br /> разработки.</p>
                    </div>
                </div>

                <div className="info-content" style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <i className="pi pi-check-circle" style={{ fontSize: '34px', color: '#3DFF00', marginRight: '25px', marginTop: '15px' }}></i>
                    <div>
                        <h2>Получите новые перспективы</h2>
                        <p>Решайте задачи и смотрите, как другие решают те же задачи. Узнайте новые техники у лучших разработчиков мира.</p>
                    </div>
                </div>

                <div className="info-content" style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <i className="pi pi-check-circle" style={{ fontSize: '34px', color: '#3DFF00', marginRight: '25px', marginTop: '15px' }}></i>
                    <div>
                        <h2>Изучайте новые языки</h2>
                        <p>Решайте задачи на языке, с которым вы знакомы а затем пробуйте на языке, который хотите улучшить. Прокачивайтесь на разных языках.</p>
                    </div>
                </div>

                <div className="info-content" style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <i className="pi pi-check-circle" style={{ fontSize: '34px', color: '#3DFF00', marginRight: '25px', marginTop: '15px' }}></i>
                    <div>
                        <h2>Развивайте свои навыки</h2>
                        <p>Учитесь у других, изучайте новые подходы<br /> и улучшайте свои навыки в решении задач.</p>
                    </div>
                </div>

                <div className="info-content" style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <i className="pi pi-check-circle" style={{ fontSize: '34px', color: '#3DFF00', marginRight: '25px', marginTop: '15px' }}></i>
                    <div>
                        <h2>Соревнуйтесь с коллегами</h2>
                        <p>Соревнуйтесь с друзьями, коллегами и сообществом<br /> в целом. Позвольте соревнованиям мотивировать вас <br /> к мастерству.</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default MainPage;
