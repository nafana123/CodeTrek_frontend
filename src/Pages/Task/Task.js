import React, { useEffect, useState } from "react";
import Sidebars from "../../Components/Sidebars/Sidebars";
import {useNavigate, useParams} from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { useRef } from 'react';


import './Task.css';

const Task = () => {
    const { id, language } = useParams();
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [taskData, setTaskData] = useState(null);
    const [code, setCode] = useState('');
    const [consoleOutput, setConsoleOutput] = useState('');
    const [consoleError, setConsoleError] = useState('');
    const toast = useRef(null);
    const navigate = useNavigate();


    const task = async () => {
        try {
            const response = await axiosInstance.get(`/task/${id}/${language}`);
            setTaskData(response.data);
        } catch (err) {
            console.log('Задача не найдена');
        }
    }

    const checkSolutionLocally = async () => {
        if (!code.trim()) {
            setConsoleError('Решение не может быть пустым');
            setConsoleOutput('');
            document.querySelector('.console-output').style.color = "red";
            return;
        }

        setConsoleOutput('');
        setConsoleError('');

        try {
            const response = await axiosInstance.post(`/execute/task/${id}`, { code });

            if (response.data.success) {
                setConsoleOutput(response.data.output);
                setConsoleError('');
                document.querySelector('.console-output').style.color = "lightgreen";
            } else {
                setConsoleOutput('');
                setConsoleError(response.data.error);
                document.querySelector('.console-output').style.color = "red";
            }
        } catch (err) {
            setConsoleError('Ошибка отправки решения');
            setConsoleOutput('');
            document.querySelector('.console-output').style.color = "red";
        }
    }

    const submitSolution = async () => {
            try {
                const token = localStorage.getItem('token');

                    const response = await axiosInstance.post(`/submit/task/${id}/${language}`,
                        {
                            code
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            }
                        }
                    );
                    if (response.data.success) {
                        navigate(`/task/solution/${id}/${language}`);
                    }
                    else{
                        toast.current.show({
                            severity: 'error',
                            summary: 'Ошибка в решение',
                            detail: ' Пожалуйста проверьте ваше решение, и отправьте его снова.',
                            life: 3500
                        });
                    }
            } catch (err) {

            }
    };

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
                        <pre className="console-output">
                            {consoleError || consoleOutput}
                        </pre>
                    </div>
                </div>
                <Toast ref={toast} position="top-right" />
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
                    <div className="buttons-container">
                        <Button
                            label="Проверить"
                            className="pButton pButtonSecondaryss"
                            onClick={checkSolutionLocally}
                        />
                        <Button
                            label="Отправить решение"
                            className="pButton pButtonSecondarysss"
                            onClick={submitSolution}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Task;