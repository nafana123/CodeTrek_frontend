import React, {useEffect, useRef, useState} from "react";
import { useParams, useLocation } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import './TaskDetails.css';
import Sidebars from "../../Components/Sidebars/Sidebars";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import languageImages from "../../Components/Languages/languageImages";
import CodeMirror from "@uiw/react-codemirror";
import { php } from '@codemirror/lang-php';
import {javascript} from "@codemirror/lang-javascript";
import {dracula} from "@uiw/codemirror-theme-dracula";
import {Button} from "primereact/button";
import { Toast } from 'primereact/toast';



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
    const [userSolutions, setUserSolutions] = useState([]);
    const location = useLocation();
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [newReplyText, setNewReplyText] = useState("");
    const toast = useRef(null);

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
            await axiosInstance.post(`/add/discussion/${id}`, messageData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            setNewMessage("");
            setReplyTo(null);
            await fetchDiscussionMessages();

        } catch (err) {
            console.log('Ошибка при отправке сообщения', err);
        }
    };


    const handleSendReply = async (discussionId) => {
        const token = localStorage.getItem('token');
        if (newMessage.trim() === "") return;

        const messageData = { message: newMessage };

        try {
            await axiosInstance.post(`/reply/${discussionId}`, messageData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            setNewMessage("");
            setReplyMessageId(null);

           await fetchDiscussionMessages();

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



    const fetchUserSolutions = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axiosInstance.get(`/user/solution/${id}`, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            setUserSolutions(response.data);
        } catch (err) {
            console.log('Ошибка при загрузке решений', err);
        }
    };

    const handleLanguageClick = (language) => {
        const selectedSolution = userSolutions.find((solution) => solution.language === language);
        setSelectedLanguage(selectedSolution || null);
    };




    useEffect(() => {
        taskDetailsData();
        fetchDiscussionMessages();
        fetchUserSolutions();

        if (location.hash === '#discussion') {
            setActiveTab('discussion');
        }
        if(location.hash === '#solution') {
            setActiveTab('solution');
        }
    }, [id, location]);

    if (!taskDetails) return <div>Loading...</div>;

    const getAvatarUrl = (avatarPath) => {
        const BASE_URL = 'http://localhost:8000';

        if (avatarPath && avatarPath.startsWith('/uploads')) {
            return `${BASE_URL}${avatarPath}`;
        }
        return avatarPath;
    };

    const handleEditMessage = async (messageId, currentText) => {
        const token = localStorage.getItem('token');
        try {
            await axiosInstance.put(`/edit/discussion/${messageId}`,
                { message: currentText },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setDiscussionMessages((prev) =>
                prev.map((msg) =>
                    msg.id === messageId ? { ...msg, message: currentText, isEdited: true } : msg
                )
            );
            setEditingMessageId(null);
            setEditingText("");

            toast.current.show({
                severity: 'success',
                summary: 'Сообщение обновлено',
                detail: 'Сообщение успешно отредактировано.',
                life: 3500
            });
        } catch (err) {
            console.error("Ошибка при редактировании сообщения:", err);
        }
    };
    const handleDeleteMessage = async (messageId) => {
        const token = localStorage.getItem('token');
        try {
            await axiosInstance.delete(`/delete/discussion/${messageId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setDiscussionMessages((prev) => prev.filter((msg) => msg.id !== messageId));

            toast.current.show({
                severity: 'success',
                summary: 'Сообщение удалено',
                detail: 'Сообщение успешно удалено.',
                life: 3500
            });
        } catch (err) {
            console.error("Ошибка при удалении сообщения:", err);
        }
    };
    const handleDeleteReply = async (replyId, messageId) => {
        const token = localStorage.getItem('token');
        try {
            await axiosInstance.delete(`/delete/reply/${replyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDiscussionMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === messageId
                        ? {
                            ...msg,
                            replies: msg.replies.filter((reply) => reply.id !== replyId)
                        }
                        : msg
                )
            );

            toast.current.show({
                severity: 'success',
                summary: 'Ответ удалён',
                detail: 'Ответ успешно удалён.',
                life: 3500
            });
        } catch (err) {
            console.error("Ошибка при удалении ответа", err);
        }
    };

    const handleEditReply = async (replyId, newMessage, messageId) => {
        const token = localStorage.getItem('token');
        if (newMessage.trim() === "") return;

        try {
            await axiosInstance.put(`/reply/${replyId}`, { message: newMessage }, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });

            setDiscussionMessages((prevMessages) =>
                prevMessages.map((msg) => {
                    if (msg.id === messageId) {
                        return {
                            ...msg,
                            replies: msg.replies.map((reply) =>
                                reply.id === replyId ? { ...reply, replyToMessage: newMessage, isEdited: true } : reply
                            ),
                        };
                    }
                    return msg;
                })
            );
            setEditingReplyId(null);
            setEditingText("");

            toast.current.show({
                severity: 'success',
                summary: 'Ответ обновлён',
                detail: 'Ответ успешно отредактирован.',
                life: 3500
            });
        } catch (err) {
            console.log('Ошибка при редактировании ответа', err);
        }
    };

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
                    <span
                        onClick={() => setActiveTab('solution')}
                        className={activeTab === 'solution' ? 'active' : ''}
                    >
                        Ваши решения ({userSolutions.length})
                    </span>

                </div>

                <div className="contentes">
                    {activeTab === 'description' && (
                        <div className="description">
                            <p className="description-text">{taskDetails.task.description}</p>
                            <h4>Входные данные:</h4>
                            <p className="input-text">{taskDetails.task.input}</p>
                            <h4>Выходные данные:</h4>
                            <p className="output-text">{taskDetails.task.output}</p>
                        </div>
                    )}
                    {activeTab === 'discussion' && (
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
                                        {message.user.avatar ? (
                                            <img
                                                src={getAvatarUrl(message.user.avatar)}
                                                alt="аватар"
                                                className="message-avatar"
                                            />
                                        ) : (
                                            <div className="message-avatar initials">
                                                {message.user.login[0].toUpperCase()}
                                            </div>
                                        )}

                                        <div className="message-user-container">
                                            <p className="message-user">
                                                {message.user.isCurrentUser ? "Ты" : message.user.login}
                                            </p>
                                        </div>

                                        <p className="message-date">
                                            {new Date(message.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    {editingMessageId === message.id ? (
                                        <div className="reply-input-container">
                        <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="reply-textarea"
                        />
                                            <button onClick={() => handleEditMessage(message.id, editingText)}
                                                    className="reply-submit-button">
                                                Сохранить
                                            </button>

                                            <button
                                                onClick={() => {
                                                setEditingMessageId(null);
                                                setEditingText("");}}
                                                className="reply-submit-button">
                                                Отменить
                                            </button>


                                        </div>
                                    ) : (
                                        <p>{message.message}</p>
                                    )}
                                    {message.isEdited && (
                                        <p className="edited-text">(изменено)</p>
                                    )}

                                    <div className="reply-button">
                                        <Button
                                            icon="pi pi-reply"
                                            className="p-button-text p-button-sm p-button-rounded"
                                            onClick={() => {
                                                setReplyMessageId(message.id);
                                                setNewReplyText("");
                                            }}
                                            title="Ответить"
                                        />
                                        {message.user.isCurrentUser && (
                                            <>
                                                <Button
                                                    icon="pi pi-pencil"
                                                    className="p-button-text p-button-sm p-button-rounded"
                                                    onClick={() => {
                                                        setEditingMessageId(message.id);
                                                        setEditingText(message.message);
                                                    }}
                                                    title="Редактировать"
                                                />
                                                <Button
                                                    icon="pi pi-trash"
                                                    className="p-button-text p-button-sm p-button-rounded p-button-danger"
                                                    onClick={() => handleDeleteMessage(message.id)}
                                                    title="Удалить"
                                                />
                                            </>
                                        )}
                                    </div>

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
                                            <button
                                                onClick={() => {
                                                    setReplyMessageId(null);
                                                }}
                                                className="reply-submit-button">
                                                Отменить
                                            </button>
                                        </div>
                                    )}

                                    {message.replies && message.replies.map((reply) => (
                                        <div key={reply.id} className="reply">
                                            <div className="reply-header">
                                                {reply.user.avatar ? (
                                                    <img
                                                        src={getAvatarUrl(reply.user.avatar)}
                                                        alt="аватар"
                                                        className="reply-avatar"
                                                    />
                                                ) : (
                                                    <div className="reply-avatar initials">
                                                        {reply.user.login[0].toUpperCase()}
                                                    </div>
                                                )}

                                                <p className="reply-user">
                                                    {reply.user.isCurrentUser ? "Ты" : reply.user.login}
                                                </p>

                                                <p className="reply-date">
                                                    {new Date(reply.createdAt).toLocaleString()}
                                                </p>
                                            </div>

                                            {editingReplyId === reply.id ? (
                                                <div className="reply-input-container">
                                <textarea
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    className="reply-textarea"
                                />
                                                    <button
                                                        onClick={() => handleEditReply(reply.id, editingText, message.id)}
                                                        className="reply-submit-button">
                                                        Сохранить
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingReplyId(null);
                                                            setEditingText("");
                                                        }}
                                                        className="reply-submit-button">
                                                        Отменить
                                                    </button>

                                                </div>
                                            ) : (
                                                <p>{reply.replyToMessage}</p>
                                            )}

                                            {reply.isEdited && (
                                                <p className="edited-text">(изменено)</p>
                                            )}

                                            {reply.user.isCurrentUser && (
                                                <>
                                                    <Button
                                                        icon="pi pi-pencil"
                                                        className="p-button-text p-button-sm"
                                                        onClick={() => {
                                                            setEditingReplyId(reply.id);
                                                            setEditingText(reply.replyToMessage);
                                                        }}
                                                        title="Редактировать"
                                                    />
                                                    <Button
                                                        icon="pi pi-trash"
                                                        className="p-button-text p-button-sm p-button-danger"
                                                        onClick={() => handleDeleteReply(reply.id, message.id)}
                                                        title="Удалить"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                    <Toast ref={toast} position="top-right" />

                    {activeTab === 'solution' && (
                        <div className="solution-tab">
                            {userSolutions.length > 0 ? (
                                <>
                                    <div className="solution-languages">
                                        {userSolutions.map((solution, index) => (
                                            <div
                                                key={index}
                                                className={`solution-language-item ${selectedLanguage === solution.language ? 'active' : ''}`}
                                                onClick={() => handleLanguageClick(solution.language)}
                                            >
                                                <img
                                                    src={languageImages[solution.language]?.src}
                                                    alt={solution.language}
                                                    onMouseEnter={(e) => (e.target.src = languageImages[solution.language]?.hoverSrc)}
                                                    onMouseLeave={(e) => (e.target.src = languageImages[solution.language]?.src)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {selectedLanguage && (
                                        <div className="solution-code">
                                            <div className="details-solved">
                                                <h4>Решение на {selectedLanguage.language}</h4>
                                                <Link
                                                    to={`/task/${taskDetails.task.taskId}/${selectedLanguage.language}`}
                                                    className="retry-button">
                                                    Перерешать
                                                </Link>
                                            </div>
                                            <CodeMirror
                                                value={selectedLanguage.code}
                                                theme={dracula}
                                                extensions={[
                                                    selectedLanguage.language === 'php' ? php() : javascript({jsx: true})
                                                ]}
                                                editable={false}
                                            />
                                        </div>
                                    )}

                                </>
                            ) : (
                                <p>У вас пока нет решений</p>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
