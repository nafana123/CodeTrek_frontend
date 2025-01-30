import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import './TaskDetails.css';
import Sidebars from "../../Components/Sidebars/Sidebars";

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
import { FaHeart } from "react-icons/fa";

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

const TaskDetails = () => {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const { id } = useParams();
    const [taskDetails, setTaskDetails] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [favorites, setFavorites] = useState(new Set());

    const renderStars = (difficulty) => {
        const stars = [];
        for (let i = 0; i < difficulty; i++) {
            stars.push(<span key={i} className="difficulty-star">★</span>);
        }
        return stars;
    };

    const taskDetailsData = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axiosInstance.get(`/details/task/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            setTaskDetails(response.data);

            const initialFavorites = new Set();
            if (response.data.isFavorite) {
                initialFavorites.add(response.data.task.id);
            }
            setFavorites(initialFavorites);
        } catch (err) {
            console.log('Ошибка при загрузке задачи', err);
        }
    };

    const handleFavoriteToggle = async (taskId) => {
        const token = localStorage.getItem('token');
        const isFavorite = favorites.has(taskId);

        try {
            await axiosInstance.post(`/tasks/${id}/favorite`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            setFavorites((prevFavorites) => {
                const updatedFavorites = new Set(prevFavorites);
                if (isFavorite) {
                    updatedFavorites.delete(taskId);
                } else {
                    updatedFavorites.add(taskId);
                }
                return updatedFavorites;
            });

            setTaskDetails((prevTaskDetails) => ({
                ...prevTaskDetails,
                task: {
                    ...prevTaskDetails.task,
                    isFavorite: !isFavorite
                }
            }));
        } catch (err) {
            console.log('Ошибка при добавлении/удалении задачи в избранное', err);
        }
    };

    useEffect(() => {
        taskDetailsData();
    }, [id]);

    if (!taskDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="task-details-data">
            <Sidebars visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />
            <div className="task-details-container">
                <h1 className='task-details-h1'>{taskDetails.task.title}</h1>
                <div className="task-header">
                    <p className="task-difficulty">
                        <strong>Сложность:</strong> {renderStars(parseInt(taskDetails.task.difficulty.level))}
                    </p>
                    <div className="language-selector">
                        <div className="language-list-details">
                            {taskDetails?.languages?.length ? (
                                taskDetails.languages.map((lang, index) => (
                                    <div key={index} className="language-item">
                                        <img
                                            src={languageImages[lang.language]?.src}
                                            alt={lang.language}
                                            className="language-image-details"
                                            onMouseEnter={(e) => (e.target.src = languageImages[lang.language]?.hoverSrc)}
                                            onMouseLeave={(e) => (e.target.src = languageImages[lang.language]?.src)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>No languages available</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="task-header-icons">
                    <FaHeart
                        className={`task-icon ${favorites.has(taskDetails.task.id) ? 'favorite' : ''}`}
                        title={favorites.has(taskDetails.task.id) ? "Удалить из избранного" : "Добавить в избранное"}
                        onClick={() => handleFavoriteToggle(taskDetails.task.id)} // Используй id задачи
                    />
                </div>
                <hr className="section-divider" />

                <div className="tabs">
                    <span
                        onClick={() => setActiveTab('description')}
                        className={activeTab === 'description' ? 'active' : ''}
                    >
                        Описание
                    </span>
                    <span
                        onClick={() => setActiveTab('discussion')}
                        className={activeTab === 'discussion' ? 'active' : ''}
                    >
                        Обсуждение
                    </span>
                </div>

                <div className="contentes">
                    {activeTab === 'description' ? (
                        <div className="description">
                            <p className="description-text">{taskDetails.task.description}</p>
                            <h4>Входные данные:</h4>
                            <p className="input-text">{taskDetails.task.input}</p>
                            <h4>Выходные данные:</h4>
                            <p className="output-text">{taskDetails.task.output}</p>
                        </div>
                    ) : (
                        <div className="discussion">
                            <h3>Discussion:</h3>
                            <p className="discussion-text">Discussion section goes here (e.g., a chat component or comments).</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
