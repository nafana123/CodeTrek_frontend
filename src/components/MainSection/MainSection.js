import React from 'react';
import { Button } from 'primereact/button';
import './MainSection.css';

const MainSection = () => {
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
                        <Button label="Начать" className="p-button-rounded p-button-primary p-button-lg" />
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
        </>
    );
};

export default MainSection;
