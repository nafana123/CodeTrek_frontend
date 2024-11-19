import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import './Sidebars.css';
import brainIcon from '../../img/sidebar/person-practicing-kickboxing-2.png';
import brainIcon1 from '../../img/sidebar/battle-3.png';
import brainIcon2 from '../../img/sidebar/team-leader.png';
import brainIcon3 from '../../img/sidebar/open-book-2.png';
import brainIcon4 from '../../img/sidebar/code-2.png';
import brainIconHover from '../../img/sidebar/person-practicing-kickboxing-4.png';
import brainIcon1Hover from '../../img/sidebar/battle-6.png';
import brainIcon2Hover from '../../img/sidebar/team-leader-4.png';
import brainIcon3Hover from '../../img/sidebar/open-book-4.png';
import brainIcon4Hover from '../../img/sidebar/code-2.png';

const icons = {
    default: [brainIcon4, brainIcon, brainIcon1, brainIcon2, brainIcon3],
    hover: [brainIcon4Hover, brainIconHover, brainIcon1Hover, brainIcon2Hover, brainIcon3Hover],
};

const Sidebars = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const textWithLineBreaks = [
        'Главная страница',
        'Решай задачи различной <br />сложности и повышай свой<br /> ранг',
        'Учавствуй в решениях задач<br />с другими пользователями',
        'Просмотр лидеров',
        'Узнайте обо всех аспектах <br />CodeTrek'
    ].map((text, index) => (
        <span key={index} dangerouslySetInnerHTML={{ __html: text }} />
));

    return (
        <Sidebar
            visible={true}
            modal={false}
            onHide={() => {}}
            className={`custom-sidebar ${isHovered ? 'expanded' : 'collapsed'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setHoveredIndex(null);
            }}
        >
            <div className="min-h-screen flex relative lg:static surface-ground">
                <div id="app-sidebar" className={`surface-section h-screen block flex-shrink-0 z-1 border-right-1 surface-border select-none ${isHovered ? 'expanded' : 'collapsed'}`}>
                    <div className="flex flex-column h-full">
                        <div className="flex-grow-1 flex flex-column justify-content-between px-4 py-3 overflow-hidden custom-style">
                            <div className="flex flex-column gap-3 main-container">
                                {textWithLineBreaks.map((textElement, index) => (
                                    <div
                                        key={index}
                                        className={`flex-row ${hoveredIndex === index ? 'hover-highlight' : ''}`}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    >
                                        <img
                                            src={hoveredIndex === index ? icons.hover[index] : icons.default[index]}
                                            className="img"
                                            alt={`Иконка ${index + 1}`}
                                        />
                                        <span className={`text-sm text-200 span-text ${isHovered ? 'expanded' : ''}`}>
                                            {textElement}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};

export default Sidebars;
