import React, { useEffect, useState } from "react";
import Sidebars from "../../components/Sidebars/Sidebars";
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';

import './Task.css';
import { Button } from "primereact/button";

const Task = () => {
    const { id, language } = useParams();
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [taskData, setTaskData] = useState(null);
    const [code, setCode] = useState("");  // Состояние для хранения кода пользователя

    // Загрузка данных задачи
    const task = async () => {
        try {
            const response = await axiosInstance.get(`/task/${id}/${language}`);
            setTaskData(response.data);
        } catch (err) {
            console.log('Задача не найдена');
        }
    }

    const submitSolution = async () => {
        const token = localStorage.getItem('token');
        const payload = { code };

        try {
            const response = await axiosInstance.post(`/solution/task/${id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
        } catch (err) {
            console.log('Ошибка в отправке решения');
        }
    }

    useEffect(() => {
        task();
    }, [id, language]);

    if (!taskData) {
        return <div>Загрузка...</div>;
    }

    const renderStars = (level) => {
        let stars = [];
        for (let i = 0; i < level; i++) {
            stars.push(<span key={i} className="star">★</span>);
        }
        return stars;
    };

    return (
        <div className="task-container">
            <Sidebars visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />

            <div className="task-contents">
                <div className="task-description">
                    <div className='langAndDiff'>
                        <div className="difficulty-container">
                            <span className="difficulty-label"><strong>Сложность:</strong></span>
                            <span className="difficulty-stars">{renderStars(taskData.difficulty)}</span>
                        </div>
                        <div className="language-container">
                            <span className="language-label"><strong>Язык:</strong></span>
                            <span className="language-name">{taskData.language}</span>
                        </div>
                    </div>

                    <h2 className='title'>{taskData.title}</h2>
                    <p><strong>Описание:</strong> {taskData.description}</p>
                    <p><strong>Входные данные:</strong> {taskData.input}</p>
                    <p><strong>Выходные данные:</strong> {taskData.output}</p>
                    <div className='console-container'>
                        <h1>Консоль</h1>
                    </div>
                </div>

                <div className="task-solution">
                    <h5 className='titles'>Решение задачи</h5>
                    <CodeMirror
                        value={code}
                        height="630px"
                        theme={dracula}
                        extensions={[javascript({jsx: true})]}
                        onChange={(value, viewUpdate) => {
                            setCode(value);
                        }}
                    />
                    <Button
                        label="Отправить решение"
                        className="pButton pButtonSecondarysss"
                        onClick={submitSolution}
                    />
                </div>
            </div>
        </div>
    );
}
export default Task;