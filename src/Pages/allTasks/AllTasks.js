import React, { useEffect, useState } from "react";
import Sidebars from "../../components/Sidebars/Sidebars";
import axiosInstance from '../../axiosInstance';
import './AllTasks.css';
import { Button } from "primereact/button";
import {Link} from "react-router-dom";


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
                                <h2>{task.title || 'Задача не найдена'}</h2>
                                <p>{task.description || 'Описание недоступно'}</p>

                                <div className="task-example-section">
                                    <h3>Пример:</h3>
                                    <div className="task-example">
                                        <p><strong>Вход:</strong> {task.input || 'Описание недоступно'}</p>
                                        <p><strong>Выход:</strong> {task.output || 'Описание недоступно'}</p>
                                    </div>
                                </div>
                                <Link to={`/task/${task.id}/${task.languages.join(', ')}`}>

                                <Button
                                    label="Выбрать задачу"
                                    className="pButton task-buttons"
                                    onClick={() => console.log(`Задача ${task.id} выбрана`)}
                                />
                                </Link>

                            </div>
                            <div className="task-details-task">
                                <p>
                                    <strong>Уровень сложности:</strong> {renderStars(parseInt(task.difficulty)) || 'Не указан'}
                                </p>
                                <p>
                                    <strong>Язык:</strong> {task.languages?.join(', ') || 'Не указан'}
                                </p>
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
