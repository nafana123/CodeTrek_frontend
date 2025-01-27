import React, { useEffect, useState } from "react";
import Sidebars from "../../Components/Sidebars/Sidebars";
import axiosInstance from '../../axiosInstance';
import './AllTasks.css';
import { Link } from "react-router-dom";
import php from '../../Img/language/php-programming-language (1).png';
import javaSvripts from '../../Img/language/js-file.png';
import python from '../../Img/language/py-file.png';
import c from '../../Img/language/c-logo.png';
import csharp from '../../Img/language/c#.png';
import java from '../../Img/language/java.png';
import swift from '../../Img/language/swift.png';
import typeScript from '../../Img/language/typescript.png';
import phpHover from '../../Img/language/img_3.png';
import jsHover from '../../Img/language/img_4.png';
import pythonHover from '../../Img/language/img_5.png';
import cHover from '../../Img/language/img_6.png';
import csharpHover from '../../Img/language/img_7.png';
import swiftHover from '../../Img/language/img_8.png';
import typeScriptHover from '../../Img/language/img_9.png';
import javaHover from "../../Img/language/img_2.png";

const languageImages = {
    php: { src: php, hoverSrc: phpHover },
    javaScript: { src: javaSvripts, hoverSrc: jsHover },
    python: { src: python, hoverSrc: pythonHover },
    c: { src: c, hoverSrc: cHover },
    csharp: { src: csharp, hoverSrc: csharpHover },
    java: { src: java, hoverSrc: javaHover },
    swift: { src: swift, hoverSrc: swiftHover },
    typeScript: { src: typeScript, hoverSrc: typeScriptHover }
};

const AllTasks = () => {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [tasks, setTasks] = useState([]);

    const allTasks = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axiosInstance.get(`/all/tasks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            setTasks(response.data);
            console.log(response.data);
        } catch (err) {
            console.log('Ошибка при загрузке задач', err);
        }
    };

    useEffect(() => {
        allTasks();
    }, []);

    const renderStars = (difficulty) => {
        const stars = [];
        for (let i = 0; i < difficulty; i++) {
            stars.push(<span key={i} className="difficulty-star">★</span>);
        }
        return stars;
    };

    return (
        <div className="task-page-container">
            <Sidebars visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />

            <div className="task-list-container">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div key={task.id} className="task-all-item">
                            <div className="task-all-info">
                                <div className="task-header">
                                    <h2>{task.title || 'Задача не найдена'}</h2>
                                    <div className="task-difficulty">
                                        <strong>Уровень
                                            сложности:</strong> {renderStars(parseInt(task.difficulty)) || 'Не указан'}
                                    </div>
                                </div>
                                <p>{task.description || 'Описание недоступно'}</p>
                                <h3>Пример:</h3>

                                <div className="task-example-section">
                                    <div className="task-example">
                                        <p><strong>Вход:</strong> {task.input || 'Описание недоступно'}</p>
                                        <p><strong>Выход:</strong> {task.output || 'Описание недоступно'}</p>
                                    </div>
                                    <div className="language-selector">
                                        <div className="language-list">
                                            {task.languages?.map((lang, index) => (
                                                <Link key={index} to={`/task/${task.id}/${lang}`}>
                                                    <div className="language-image-wrapper">
                                                        <img
                                                            src={languageImages[lang]?.src}
                                                            alt={lang}
                                                            className="language-image"
                                                            onMouseEnter={(e) => (e.target.src = languageImages[lang]?.hoverSrc)}
                                                            onMouseLeave={(e) => (e.target.src = languageImages[lang]?.src)}
                                                        />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Задачи не найдены</p>
                )}
            </div>
        </div>
    );
};

export default AllTasks;
