import React, { useEffect, useState } from "react";
import Sidebars from "../../components/Sidebars/Sidebars";
import axiosInstance from '../../axiosInstance';
import { useParams } from "react-router-dom";
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import './TaskSolution.css';
import CodeMirror from "@uiw/react-codemirror";
import {dracula} from "@uiw/codemirror-theme-dracula";
import {javascript} from "@codemirror/lang-javascript";

const TaskSolution = () => {
    const { id, language } = useParams();
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [userSolvedTask, setUserSolvedTask] = useState(null);
    const [solvedTasksList, setSolvedTasksList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(7);

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
        } catch (err) {
            console.log('ошибка', err);
        }
    }

    useEffect(() => {
        taskOutput();
    }, [id]);

    const onPageChange = (event) => {
        setCurrentPage(event.first / event.rows);
    }

    const paginatedSolutions = solvedTasksList.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
    );

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
                                <pre>
                                <CodeMirror
                                    value={userSolvedTask.code}
                                    theme={dracula}
                                    extensions={[javascript({jsx: true})]}
                                    editable={false}
                                />
                                </pre>
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
                        <div className="other-solutions-details">
                            <h3>Решения других пользователей</h3>
                            {solvedTasksList.length > 0 && (
                                <p className="solutions-count">{`Всего решений: ${solvedTasksList.length}`}</p>
                            )}
                        </div>
                        {paginatedSolutions.map((task, index) => (
                            <div key={task.id} className="solution-item">
                                <div className="user-infos">
                                    <p className="username">
                                        <strong>Пользователь: {task.user.login}</strong>
                                        <strong>Решение №{(currentPage * pageSize) + index + 1}</strong>

                                    </p>
                                </div>

                                <pre>
                                     <CodeMirror
                                         value={task.code}
                                         theme={dracula}
                                         extensions={[javascript({jsx: true})]}
                                         editable={false}
                                     />
                                </pre>
                            </div>
                        ))}
                        <Paginator
                            first={currentPage * pageSize}
                            rows={pageSize}
                            totalRecords={solvedTasksList.length}
                            onPageChange={onPageChange}
                            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            className="p-mt-3"
                        />
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