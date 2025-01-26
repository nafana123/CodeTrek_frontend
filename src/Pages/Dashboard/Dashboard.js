import React, { useState, useEffect } from 'react';
import Sidebars from '../../Components/Sidebars/Sidebars';
import './Dashboard.css';
import java from '../../Img/language/java.png';
import javaSvripts from '../../Img/language/js-file.png';
import c from '../../Img/language/c-logo.png';
import csharp from '../../Img/language/c#.png';
import python from '../../Img/language/py-file.png';
import php from '../../Img/language/php-programming-language (1).png';
import swift from '../../Img/language/swift.png';
import typeScript from '../../Img/language/typescript.png';
import javaHover from '../../Img/language/img_2.png';
import phpHover from '../../Img/language/img_3.png';
import jsHover from '../../Img/language/img_4.png';
import pythonHover from '../../Img/language/img_5.png';
import cHover from '../../Img/language/img_6.png';
import csharpHover from '../../Img/language/img_7.png';
import swiftHover from '../../Img/language/img_8.png';
import typeScriptHover from '../../Img/language/img_9.png';
import axiosInstance from '../../axiosInstance';
import {Button} from "primereact/button";
import {Link} from "react-router-dom";
import { ChevronRight, ChevronLeft } from 'lucide-react';


const Dashboard = () => {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [userLanguages, setUserLanguages] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

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

    const fetchUserLanguages = async () => {
        const token = localStorage.getItem('token');
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

    const choiceTasks = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axiosInstance.get('/choice/tasks', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setTasks(response.data.tasks);
        } catch (error) {
            console.error('Error sending tasks:', error);
        }
    };

    useEffect(() => {
        fetchUserLanguages();
        choiceTasks();
    }, []);

    const languageClick = async (lang) => {
        const token = localStorage.getItem('token');

        try {
            const response = await axiosInstance.post('/language/selection', { lang }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const selectedLanguages = response.data.lang.map(language => language.name);
            setUserLanguages(selectedLanguages);
            choiceTasks();
        } catch (error) {
            console.error('Error sending language:', error);
        }
    };

    const handlePrevTask = () => {
        setCurrentTaskIndex(prevIndex => (prevIndex === 0 ? tasks.length - 1 : prevIndex - 1));
    };

    const handleNextTask = () => {
        setCurrentTaskIndex(prevIndex => (prevIndex === tasks.length - 1 ? 0 : prevIndex + 1));
    };

    const renderStars = (level) => {
        let stars = [];
        for (let i = 0; i < level; i++) {
            stars.push(<span key={i} className="star">★</span>);
        }
        return stars;
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

            <h1 className="choseTask">Выберите задачу</h1>
            <div className="taskContainer">
                {tasks.length > 0 ? (
                    <div className="task-content">
                        <div className="task-info">
                            <h2>{tasks[currentTaskIndex]?.title || 'Задача не найдена'}</h2>
                            <p>{tasks[currentTaskIndex]?.description || 'Описание недоступно'}</p>

                            <div className="example">
                                <h3>Пример:</h3>
                                <div className="task-example">
                                    <p><strong>Вход:</strong> {tasks[currentTaskIndex]?.input || 'Описание недоступно'}</p>
                                    <p><strong>Выход:</strong> {tasks[currentTaskIndex]?.output || 'Описание недоступно'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="task-details">
                            <p><strong>Уровень сложности:</strong> {renderStars(tasks[currentTaskIndex]?.difficultyLevel || 0)}</p>
                            <p><strong>Язык:</strong> {tasks[currentTaskIndex]?.languageName || 'Не указан'}</p>
                        </div>
                    </div>
                ) : (
                    <p>Прежде чем приступить к задаче выберите язык.</p>
                )}
            </div>

            {tasks.length > 0 && (
                <div className="buttonTasks">
                    <ChevronLeft size={50} onClick={handlePrevTask} className="buttonHandleTasksPrev" />
                    <Link to={`/task/${tasks[currentTaskIndex]?.id}/${tasks[currentTaskIndex]?.languageName}`}>
                        <Button label="Выбрать" className="pButton pButtonSecondary" />
                    </Link>
                    <ChevronRight size={50} onClick={handleNextTask} className="buttonHandleTasksNext" />
                </div>
            )}

            <Sidebars visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />
        </div>
    );
};

export default Dashboard;
