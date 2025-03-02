import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import './TaskDetails.css';
import Sidebars from "../../Components/Sidebars/Sidebars";
import { Link } from "react-router-dom";
import { FaHeart, FaReply } from "react-icons/fa";
import languageImages from "../../Components/Languages/languageImages";



const TaskDetails = () => {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const { id } = useParams();
    const [taskDetails, setTaskDetails] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [favorites, setFavorites] = useState(new Set());
    const [discussionMessages, setDiscussionMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [replyMessageId, setReplyMessageId] = useState(null);

    const location = useLocation();

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
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            setTaskDetails(response.data);
            const initialFavorites = new Set();
            if (response.data.isFavorite) initialFavorites.add(response.data.task.id);
            setFavorites(initialFavorites);
        } catch (err) {
            console.log('Ошибка при загрузке задачи', err);
        }
    };

    const fetchDiscussionMessages = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axiosInstance.get(`/discussion/${id}`, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            setDiscussionMessages(response.data);
        } catch (err) {
            console.log('Ошибка при загрузке обсуждений', err);
        }
    };

    const handleFavoriteToggle = async (taskId) => {
        const token = localStorage.getItem('token');
        const isFavorite = favorites.has(taskId);
        try {
            await axiosInstance.post(`/tasks/${id}/favorite`, {}, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            setFavorites((prevFavorites) => {
                const updatedFavorites = new Set(prevFavorites);
                if (isFavorite) updatedFavorites.delete(taskId);
                else updatedFavorites.add(taskId);
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

    const handleSendMessage = async () => {
        const token = localStorage.getItem('token');
        if (newMessage.trim() === "") return;

        const messageData = {
            message: newMessage,
            replyTo: replyTo ? replyTo.id : null,
        };

        try {
            const response = await axiosInstance.post(`/add/discussion/${id}`, messageData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            const newMessageData = {
                ...messageData,
                id: response.data.id,
                user: { login: "Ты" },
                createdAt: new Date().toISOString(),
            };

            setDiscussionMessages((prevMessages) => [...prevMessages, newMessageData]);

            setNewMessage("");
            setReplyTo(null);

        } catch (err) {
            console.log('Ошибка при отправке сообщения', err);
        }
    };

    const handleSendReply = async (discussionId) => {
        const token = localStorage.getItem('token');
        if (newMessage.trim() === "") return;

        const messageData = { message: newMessage };

        try {
            const response = await axiosInstance.post(`/reply/${discussionId}`, messageData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            setDiscussionMessages((prevMessages) => {
                return prevMessages.map((msg) => {
                    if (msg.id === discussionId) {
                        return {
                            ...msg,
                            replies: [
                                ...(msg.replies || []),
                                {
                                    user: { login: "Ты" },
                                    replyToMessage: newMessage,
                                    createdAt: new Date().toISOString(),
                                    id: response.data.id
                                }
                            ]
                        };
                    }
                    return msg;
                });
            });

            setNewMessage("");
            setReplyMessageId(null);
        } catch (err) {
            console.log('Ошибка при отправке ответа', err);
        }
    };
    const getTotalMessagesCount = () => {
        let totalMessages = discussionMessages.length;
        discussionMessages.forEach(msg => {
            if (msg.replies) {
                totalMessages += msg.replies.length;
            }
        });
        return totalMessages;
    };

    useEffect(() => {
        taskDetailsData();
        fetchDiscussionMessages();

        if (location.hash === '#discussion') {
            setActiveTab('discussion');
        }
    }, [id, location]);

    if (!taskDetails) return <div>Loading...</div>;

    return (
        <div className="task-details-data">
            <Sidebars visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />
            <div className="task-details-container">
                <h1 className="task-details-h1">{taskDetails.task.title}</h1>
                <div className="task-header">
                    <p className="task-difficulty">
                        <strong>Сложность:</strong> {renderStars(parseInt(taskDetails.task.difficulty.level))}
                    </p>
                    <div className="language-selector">
                        <div className="language-list-details">
                            {taskDetails?.languages?.length ? (
                                taskDetails.languages.map((lang, index) => (
                                    <Link key={index} to={`/task/${taskDetails.task.taskId}/${lang.language}`}>
                                    <div key={index} className="language-item">
                                        <img
                                            src={languageImages[lang.language]?.src}
                                            alt={lang.language}
                                            className="language-image-details"
                                            onMouseEnter={(e) => (e.target.src = languageImages[lang.language]?.hoverSrc)}
                                            onMouseLeave={(e) => (e.target.src = languageImages[lang.language]?.src)}
                                        />
                                    </div>
                                    </Link>
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
                        onClick={() => handleFavoriteToggle(taskDetails.task.id)}
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
                        Обсуждение ({getTotalMessagesCount()})
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
                            <div className="new-message">
                                <textarea
                                    placeholder="Напишите ваше сообщение..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button onClick={handleSendMessage}>Отправить сообщение</button>
                            </div>
                            {discussionMessages.map((message) => (
                                <div key={message.id} className="message">
                                    <div className="message-header">
                                        <p className="message-user">
                                            {message.isCurrentUser ? "Ты" : message.user.login}
                                        </p>
                                        <p className="message-date">{new Date(message.createdAt).toLocaleString()}</p>
                                    </div>
                                    <p>{message.message}</p>
                                    <div className="reply-button">
                                        <FaReply
                                            className="reply-icon"
                                            onClick={() => setReplyMessageId(message.id)}
                                            title="Ответить"
                                        />
                                    </div>

                                    {message.replies && message.replies.map((reply, index) => (
                                        <div key={index} className="reply">
                                            <div className="reply-header">
                                                <p className="reply-user">
                                                    {reply.isCurrentUser ? "Ты" : reply.user.login}
                                                </p>
                                                <p className="reply-date">{new Date(reply.createdAt).toLocaleString()}</p>
                                            </div>
                                            <p>{reply.replyToMessage}</p>
                                        </div>
                                    ))}

                                    {replyMessageId === message.id && (
                                        <div className="reply-input-container">
                    <textarea
                        placeholder="Напишите ваш ответ..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="reply-textarea"
                    />
                                            <button onClick={() => handleSendReply(message.id)}
                                                    className="reply-submit-button">
                                                Отправить ответ
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
