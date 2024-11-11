import React, { useState, useEffect } from 'react';
import Sidebars from '../../components/Sidebars/Sidebars';
import './Dashboard.css';
import java from '../../img/language/java.png';
import javaSvripts from '../../img/language/js-file.png';
import c from '../../img/language/c-logo.png';
import csharp from '../../img/language/c#.png';
import python from '../../img/language/py-file.png';
import php from '../../img/language/php-programming-language (1).png';
import swift from '../../img/language/swift.png';
import typeScript from '../../img/language/typescript.png';
import javaHover from '../../img/language/img_2.png';
import phpHover from '../../img/language/img_3.png';
import jsHover from '../../img/language/img_4.png';
import pythonHover from '../../img/language/img_5.png';
import cHover from '../../img/language/img_6.png';
import csharpHover from '../../img/language/img_7.png';
import swiftHover from '../../img/language/img_8.png';
import typeScriptHover from '../../img/language/img_9.png';
import axiosInstance from '../../axiosInstance';

const Dashboard = () => {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [userLanguages, setUserLanguages] = useState([]);

    const languages = [
        { src: php, alt: 'php', hoverSrc: phpHover },
        { src: javaSvripts, alt: 'javaScript', hoverSrc: jsHover },
        { src: python, alt: 'python', hoverSrc: pythonHover },
        { src: c, alt: 'c++', hoverSrc: cHover },
        { src: csharp, alt: 'c#', hoverSrc: csharpHover },
        { src: java, alt: 'java', hoverSrc: javaHover },
        { src: swift, alt: 'swift', hoverSrc: swiftHover },
        { src: typeScript, alt: 'typeScript', hoverSrc: typeScriptHover }
    ];

    useEffect(() => {
        const fetchUserLanguages = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Токен не найден в localStorage');
                return;
            }

            try {
                const response = await axiosInstance.get('/user/languages', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const selectedLanguages = response.data.lang.map(language => language.name);
                setUserLanguages(selectedLanguages);
            } catch (error) {
                console.error('Ошибка при загрузке выбранных языков:', error);
            }
        };

        fetchUserLanguages();
    }, []);

    const languageClick = async (lang) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Токен не найден в localStorage');
            return;
        }

        try {
            const response = await axiosInstance.post('/language/selection', { lang }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const selectedLanguages = response.data.lang.map(language => language.name);
            setUserLanguages(selectedLanguages);
        } catch (error) {
            console.error('Error sending language:', error);
        }
    };

    return (
        <div className="dashboard">
            <h1 className="lang">Выберите языки:</h1>

            <div className="languages-grid">
                {languages.map((lang, index) => (
                    <div
                        key={index}
                        className="language-img-wrapper"
                        onClick={() => languageClick(lang.alt)}
                    >
                        <img
                            className="language-img"
                            src={userLanguages.includes(lang.alt) ? lang.hoverSrc : lang.src}
                            alt={lang.alt}
                        />
                    </div>
                ))}
            </div>

            <Sidebars visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />
        </div>
    );
};

export default Dashboard;
