import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import './HeadlessDemo.css';
import brainIcon from './img/person-practicing-kickboxing-2.png';
import brainIcon1 from './img/battle-3.png';
import brainIcon2 from './img/team-leader.png';
import brainIcon3 from './img/open-book-2.png';
import brainIcon4 from './img/code-2.png';

const HeadlessDemo = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Sidebar
            visible={true}
            modal={false}
            onHide={() => {}}
            className={`custom-sidebar ${isHovered ? 'expanded' : 'collapsed'}`}
            onMouseEnter={() => setIsHovered(true)} // Теперь наведение на весь сайдбар
            onMouseLeave={() => setIsHovered(false)} // И уход с него
        >
            <div className="min-h-screen flex relative lg:static surface-ground">
                <div id="app-sidebar" className={`surface-section h-screen block flex-shrink-0 z-1 border-right-1 surface-border select-none ${isHovered ? 'expanded' : 'collapsed'}`}>
                    <div className="flex flex-column h-full">
                        <div className="flex-grow-1 flex flex-column justify-content-between px-4 py-3 overflow-hidden custom-style">
                            <div className="flex flex-column gap-3">
                                <div className="flex-row">
                                    <img src={brainIcon4} className="img" alt="Иконка мозга"/>
                                    <span className={`text-sm text-200 span-text ${isHovered ? 'expanded' : ''}`}>Главная страница</span>
                                </div>
                                <div className="flex-row">
                                    <img src={brainIcon} className="img" alt="Иконка мозга"/>
                                    <span className={`text-sm text-200 span-text ${isHovered ? 'expanded' : ''}`}>Решайте задачи различной<br/> сложности и повышай<br/> свой ранг</span>
                                </div>
                                <div className="flex-row">
                                    <img src={brainIcon1} className="img" alt="Иконка мозга"/>
                                    <span className={`text-sm text-200 span-text ${isHovered ? 'expanded' : ''}`}>Учавствуй в решениях задач с <br/>другими пользователями</span>
                                </div>
                                <div className="flex-row">
                                    <img src={brainIcon2} className="img" alt="Иконка мозга"/>
                                    <span className={`text-sm text-200 span-text ${isHovered ? 'expanded' : ''}`}>Просмотр лидеров</span>
                                </div>
                                <div className="flex-row">
                                    <img src={brainIcon3} className="img" alt="Иконка мозга"/>
                                    <span className={`text-sm text-200 span-text ${isHovered ? 'expanded' : ''}`}>Узнайте обо всех <br/>аспектах CodeTrek.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};

export default HeadlessDemo;
