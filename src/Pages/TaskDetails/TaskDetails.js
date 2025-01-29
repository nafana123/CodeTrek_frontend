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
        } catch (err) {
            console.log('Ошибка при загрузке задач', err);
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
                <h1>{taskDetails.task.title}</h1>

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
