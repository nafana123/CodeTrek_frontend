import React, { useEffect, useState } from "react";
import Sidebars from "../../components/Sidebars/Sidebars";
import axiosInstance from '../../axiosInstance';
import { useParams } from "react-router-dom";
import './TaskSolution.css';

const TaskSolution = () => {
    const { id, language } = useParams();
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [userSolvedTask, setUserSolvedTask] = useState(null);
    const [solvedTasksList, setSolvedTasksList] = useState([]);

    const taskOutput = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axiosInstance.get(`/output/task/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            setUserSolvedTask(response.data.userSolvedTask);
            setSolvedTasksList(response.data.solvedTasksList);
            console.log(response.data);
        } catch (err) {
            console.log('ошибка', err);
        }
    }

    useEffect(() => {
        taskOutput();
    }, [id]);

    return (
        <div className="task-solution-container">
            <Sidebars visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />

            <div className="task-output-container">
                {userSolvedTask && (
                    <div className="task-content">
                        <div className="task-infos">
                            <h2>{userSolvedTask.task.title || 'Задача не найдена'}</h2>
                            <p>{userSolvedTask.task.description || 'Описание недоступно'}</p>

                            <div className="examples">
                                <h3>Пример:</h3>
                                <div className="task-examples">
                                    <p><strong>Вход:</strong> {userSolvedTask.task.input || 'Описание недоступно'}</p>
                                    <p><strong>Выход:</strong> {userSolvedTask.task.output || 'Описание недоступно'}</p>
                                </div>
                            </div>
                            <div className="user-code">
                                <pre><strong>Ваш код:</strong></pre>
                                <pre>{userSolvedTask.code}</pre>
                            </div>
                        </div>
                        <div className="task-detailss">
                            <p><strong>Уровень сложности:</strong> {renderStars(userSolvedTask.task.difficulty.level || 0)}</p>
                            <p><strong>Язык:</strong> {language || 'Не указан'}</p>
                        </div>
                    </div>
                )}

                {solvedTasksList.length > 0 && (
                    <div className="other-solutions">
                        <h3>Решения других пользователей</h3>
                        {solvedTasksList.map((task, index) => (
                            <div key={task.id} className="solution-item">
                                <p><strong>Решение пользователя:</strong> {task.user.login}</p>
                                <pre><strong>Код:</strong></pre>
                                <pre>{task.code}</pre>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const renderStars = (difficulty) => {
    const stars = [];
    for (let i = 0; i < difficulty; i++) {
        stars.push(<span key={i} className="star">★</span>);
    }
    return stars;
};

export default TaskSolution;
