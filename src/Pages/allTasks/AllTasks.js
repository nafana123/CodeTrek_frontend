import React, { useEffect, useState } from "react";
import Sidebars from "../../Components/Sidebars/Sidebars";
import axiosInstance from '../../axiosInstance';
import './AllTasks.css';
import { Link } from "react-router-dom";
import { FaHeart, FaComments, FaCheckCircle } from 'react-icons/fa';
import languageImages from "../../Components/Languages/languageImages";

const AllTasks = () => {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [favorites, setFavorites] = useState(new Set());

    const allTasks = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axiosInstance.get(`/all/tasks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            console.log(response.data)
            setTasks(response.data);
            const initialFavorites = new Set(response.data.filter(task => task.isFavorite).map(task => task.id));
            setFavorites(initialFavorites);
        } catch (err) {
            console.log('Ошибка при загрузке задач', err);
        }
    };

    useEffect(() => {
        allTasks();
    }, []);

    const handleFavoriteToggle = async (taskId) => {
        const token = localStorage.getItem('token');
        const isFavorite = favorites.has(taskId);

        try {
            const response = await axiosInstance.post(`/tasks/${taskId}/favorite`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.success) {
                setFavorites((prevFavorites) => {
                    const updatedFavorites = new Set(prevFavorites);
                    if (isFavorite) {
                        updatedFavorites.delete(taskId);
                    } else {
                        updatedFavorites.add(taskId);
                    }
                    return updatedFavorites;
                });

                setTasks((prevTasks) => prevTasks.map((task) =>
                    task.id === taskId
                        ? { ...task, isFavorite: !isFavorite }
                        : task
                ));
            }
        } catch (err) {
            console.log('Ошибка при добавлении/удалении задачи в избранное', err);
        }
    };

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
                                    <Link to={`/details/task/${task.id}`}>
                                        <h2>{task.title || 'Задача не найдена'}</h2>
                                    </Link>
                                    <div className="task-difficulty">
                                        <strong>Уровень
                                            сложности:</strong> {renderStars(parseInt(task.difficulty)) || 'Не указан'}
                                    </div>
                                </div>
                                <div className="task-header-icons">
                                    <FaHeart
                                        className={`task-icon ${favorites.has(task.id) ? 'favorite' : ''}`}
                                        title={favorites.has(task.id) ? "Удалить из избранного" : "Добавить в избранное"}
                                        onClick={() => handleFavoriteToggle(task.id)}
                                    />
                                    <Link to={`/details/task/${task.id}#discussion`}>
                                        <div className="task-comments">
                                            <FaComments className="task-icon" title="Обсудить задачу" />
                                            <span className="task-comments-count" title="Количество обсуждений">
                                                ({task.totalMessages})
                                            </span>
                                        </div>
                                    </Link>



                                    <FaCheckCircle className="task-icon" title="Количество решений"/>
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
