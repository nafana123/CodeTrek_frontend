import React, { useEffect, useRef, useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import { Paginator } from "primereact/paginator";
import Sidebars from "../../Components/Sidebars/Sidebars";
import axiosInstance from "../../axiosInstance";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import "./Profile.css";
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Profile = () => {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [user, setUser] = useState(null);
    const [solvedTasks, setSolvedTasks] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const tasksPerPage = 3;
    const [editLogin, setEditLogin] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const toast = useRef(null);
    const [favoriteTasks, setFavoriteTasks] = useState([]);
    const [discussion, setDiscussion] = useState([]);
    const avatarInputRef = useRef(null);
    const [avatarFile, setAvatarFile] = useState([]);

    const items = [
        { label: "Решённые задачи", icon: "pi pi-fw pi-check" },
        { label: "Данные", icon: "pi pi-fw pi-info-circle" },
        { label: "Избранное", icon: "pi pi-fw pi-heart" },
        { label: "Обсуждение", icon: "pi pi-fw pi-book" },
    ];

    const renderStars = (difficulty) => {
        return Array.from({ length: difficulty }, (_, i) => (
            <span key={i} className="star">★</span>
        ));
    };

    const getDataUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axiosInstance.get("/user/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const { user, solvedTasks } = response.data;
            setUser(user);
            setSolvedTasks(solvedTasks);
            setEditLogin(user.login);
            setEditEmail(user.email);

            const uniqueLanguages = [...new Set(solvedTasks.map(task => task.language))];
            setLanguages(uniqueLanguages);
        } catch (error) {
            console.error("Ошибка при получении данных пользователя:", error);
        }
    };

    const getUserDiscussion = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axiosInstance.get("/user/discussion", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const groupedDiscussion = groupDiscussionByTask(response.data);
            setDiscussion(groupedDiscussion);
        } catch (error) {
            console.error("Ошибка при получении обсуждений:", error);
        }
    };

    const groupDiscussionByTask = (discussionData) => {
        const grouped = discussionData.reduce((acc, item) => {
            if (!acc[item.taskId]) {
                acc[item.taskId] = {
                    taskTitle: item.taskTitle,
                    taskId: item.taskId,
                    difficulty: item.difficulty,
                    messages: [],
                    replies: item.replies,
                };
            }
            acc[item.taskId].messages.push(item.message);
            return acc;
        }, {});

        return Object.values(grouped);
    };

    const getFavoriteTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axiosInstance.get("/user/favorites", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setFavoriteTasks(response.data);
        } catch (error) {
            console.error("Ошибка при получении избранных задач:", error);
        }
    };

    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axiosInstance.patch("/user/profile/edit", {
                login: editLogin,
                email: editEmail,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setUser((prevUser) => ({
                ...prevUser,
                login: editLogin,
                email: editEmail,
            }));
            toast.current.show({
                severity: 'success',
                summary: 'Данные успешно обновлены',
                life: 3500
            });

        } catch (error) {
            console.error("Ошибка при обновлении данных:", error);
            alert('Произошла ошибка при обновлении данных.');
        }
    };

    useEffect(() => {
        getDataUser();
        getFavoriteTasks();
        getUserDiscussion();
    }, []);

    const getChartData = (tasks) => {
        const difficultyCounts = {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
        };

        tasks.forEach(task => {
            if (difficultyCounts[task.difficulty] !== undefined) {
                difficultyCounts[task.difficulty]++;
            }
        });

        return {
            labels: ["Уровень 1", "Уровень 2", "Уровень 3", "Уровень 4", "Уровень 5"],
            datasets: [
                {
                    label: "Количество решённых задач",
                    data: Object.values(difficultyCounts),
                    backgroundColor: [
                        "rgba(102, 204, 255, 0.8)",
                        "rgba(102, 255, 102, 0.8)",
                        "rgba(255, 255, 102, 0.8)",
                        "rgba(255, 153, 51, 0.8)",
                        "rgba(255, 102, 102, 0.8)",
                    ],
                    borderColor: [
                        "rgba(102, 204, 255, 1)",
                        "rgba(102, 255, 102, 1)",
                        "rgba(255, 255, 102, 1)",
                        "rgba(255, 153, 51, 1)",
                        "rgba(255, 102, 102, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    const onPageChange = (e) => {
        setCurrentPage(e.first / tasksPerPage);
    };

    const getInitials = (username) => {
        if (!username) return '';
        const nameParts = username.split(" ");
        return (nameParts[0]?.[0]?.toUpperCase() || '') + (nameParts[1]?.[0]?.toUpperCase() || '');
    };

    const indexOfFirstTask = currentPage * tasksPerPage;
    const currentTasks = solvedTasks.slice(indexOfFirstTask, indexOfFirstTask + tasksPerPage);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarFile(file);
        uploadAvatar(file);
        e.target.value = null;

    };

    const uploadAvatar = async (file) => {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const response = await axiosInstance.post("/user/avatar", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newAvatar = response.data.avatar;
            setUser((prevUser) => ({
                ...prevUser,
                avatar: newAvatar
            }));

            toast.current.show({
                severity: 'success',
                summary: 'Аватар успешно обновлён',
                life: 3500
            });
        } catch (error) {
            console.error("Ошибка при загрузке аватара:", error);
            alert("Произошла ошибка при загрузке аватара.");
        }
    };

    const getAvatarUrl = (avatarPath) => {
        const BASE_URL = 'http://localhost:8000';

        if (avatarPath && avatarPath.startsWith('/uploads')) {
            return `${BASE_URL}${avatarPath}`;
        }
        return avatarPath;
    };

    const deleteAvatar = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await axiosInstance.post("/delete/user/avatar", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            console.log(response);

            toast.current.show({
                severity: 'success',
                summary: 'Аватар успешно удалён',
                life: 3500
            });

            setUser(prev => ({ ...prev, avatar: null }));
        } catch (error) {
            console.error("Ошибка при удалении аватара:", error);
        }
    };


    return (
        <div className="profile-page">
            <Sidebars visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />
            <div className="profile-container">
                <div className="left-container">
                    {user ? (
                        <div className="profil-container">
                            <p><strong>Дата регистрации:</strong> {user.registrationDate}</p>
                            <div className="profile-card">
                                <div className="profile-avatar">
                                    {user.avatar ? (
                                        <>
                                            <img
                                                src={getAvatarUrl(user.avatar)}
                                                alt="Аватар"
                                                className="avatar-img"
                                            />
                                            <Button
                                                icon="pi pi-times"
                                                className="remove-avatar-btn p-button-rounded p-button-danger"
                                                aria-label="Удалить аватар"
                                                style={{position: 'absolute', top: '160px', left: '305px', width: '20px', height: '20px', color: 'red', background: 'transparent', border: 'none',}}
                                                onClick={deleteAvatar}
                                            />

                                        </>
                                    ) : (
                                        getInitials(user.login || '')
                                    )}
                                </div>

                                <div className="profile-info">
                                    <h3>{user.login}</h3>
                                    <p>{user.email}</p>
                                    <p>Ранк: {user.rank || "Не определено"}</p>
                                </div>
                            </div>
                            <hr className="profile-divider"/>
                            <div className="profile-sections">
                                <div className="profile-section">
                                    <span className="section-icon">📄</span>
                                    <p className="section-p">Решено</p>
                                    <p className="section-p">{solvedTasks.length}</p>
                                </div>
                                <div className="profile-section">
                                    <span className="section-icon">💬</span>
                                    <p className="section-p">Обсуждение</p>
                                    <p className="section-p">{discussion.length}</p>
                                </div>
                                <div className="profile-section">
                                    <span className="section-icon">❤️</span>
                                    <p className="section-p">Избранное</p>
                                    <p className="section-p">{favoriteTasks.length}</p>
                                </div>
                            </div>
                            <hr className="profile-divider" />
                            <h5>Языки</h5>
                            <div className="profile-sections">
                                {languages.length > 0 ? (
                                    languages.map((language, index) => (
                                        <p key={`${language}-${index}`} className="section-p">{language}</p>
                                    ))
                                ) : (
                                    <p className="section-p">Нет решённых задач с указанием языка</p>
                                )}
                            </div>
                            <hr className="profile-divider" />
                        </div>
                    ) : (
                        <div className="loading-placeholder">Загрузка данных...</div>
                    )}
                </div>

                <div className="right-container">
                    <div className="upper-box">
                        <h3>Статистика задач</h3>
                        <Bar
                            data={getChartData(solvedTasks)}
                            options={{
                                responsive: true,
                                plugins: {
                                    title: {
                                        color: "white",
                                        display: true,
                                        text: "Статистика решённых задач",
                                    },
                                    legend: {
                                        display: false,
                                    },
                                },
                                scales: {
                                    x: {
                                        grid: {
                                            color: "white",
                                        },
                                        ticks: {
                                            color: "white",
                                        },
                                    },
                                    y: {
                                        beginAtZero: true,
                                        min: 0,
                                        max: 20,
                                        ticks: {
                                            stepSize: 2,
                                            color: "white",
                                        },
                                        grid: {
                                            color: "white",
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                    <Toast ref={toast} position="top-right" />
                    <div className="lower-box">
                        <TabMenu
                            model={items}
                            activeIndex={activeTab}
                            onTabChange={(e) => setActiveTab(e.index)}
                        />
                        <div className="tab-content">
                            {activeTab === 0 && (
                                <div>
                                    {currentTasks.length > 0 ? (
                                        <div className="tasks-list">
                                            {currentTasks.map((task, index) => (
                                                <Link to={`/task/solution/${task.id}/${task.language}`}>
                                                <div key={`${task.id}-${index}`} className="task-card">
                                                    <div className="profil-inf">
                                                        <p>
                                                            <strong>Сложность:</strong> {renderStars(Number(task.difficulty))}
                                                        </p>
                                                        <p><strong>Язык:</strong> {task.language}</p>
                                                    </div>
                                                    <h5>{task.title}</h5>
                                                    <p><strong>Описание:</strong> {task.description}</p>
                                                </div>
                                                </Link>
                                            ))}
                                            <Paginator
                                                first={currentPage * tasksPerPage}
                                                rows={tasksPerPage}
                                                totalRecords={solvedTasks.length}
                                                onPageChange={onPageChange}
                                            />
                                        </div>
                                    ) : (
                                        <p>Нет решённых задач</p>
                                    )}
                                </div>
                            )}
                            {activeTab === 1 && (
                                <div className="edit-profile-form">
                                    <div className="input-group">
                                        <label htmlFor="login">Логин</label>
                                        <input
                                            type="text"
                                            id="login"
                                            value={editLogin}
                                            onChange={(e) => setEditLogin(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="email">Почта</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="avatar">Аватар</label>
                                        <input
                                            type="file"
                                            id="avatar"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                        />
                                    </div>

                                    <Button
                                        label="Сохранить"
                                        className="pButton pButtonSecondarysProfile"
                                        onClick={handleSaveChanges}
                                    />
                                </div>
                            )}

                            {activeTab === 2 && (
                                <div>
                                    {favoriteTasks.length > 0 ? (
                                        <div className="tasks-list">
                                            {favoriteTasks.map((task, index) => (
                                                <Link to={`/details/task/${task.id}`} key={index}>
                                                    <div className="task-card">
                                                        <div className="profil-inf">
                                                            <p>
                                                                <strong>Сложность:</strong> {renderStars(Number(task.difficulty))}
                                                            </p>
                                                        </div>
                                                        <h5>{task.title}</h5>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>Нет избранных задач</p>
                                    )}
                                </div>
                            )}

                            <div className="tab-content">
                                {activeTab === 3 && (

                                    <div>
                                        {discussion.length > 0 ? (
                                            <div className="tasks-list">
                                                {discussion.map((task, index) => (
                                                    <Link key={task.taskId} to={`/details/task/${task.taskId}#discussion`}>
                                                        <div className="task-card">
                                                            <div className="profil-inf">
                                                                <p>
                                                                    <strong>Сложность:</strong> {renderStars(Number(task.difficulty))}
                                                                </p>
                                                            </div>
                                                            <h5>{task.taskTitle}</h5>
                                                            <div>
                                                                <div className="comment">
                                                                    <p>Ты : {task.messages}</p>
                                                                </div>

                                                                {task.replies && task.replies.length > 0 && (
                                                                    <div className="replies">
                                                                        <h6>Ответы:</h6>
                                                                        {task.replies.map((reply, idx) => (
                                                                            <div key={idx} className="reply-profile">
                                                                                <p className="reply-profile-p" >Ты : {reply.replyMessage}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <p>Нет задач для обсуждения</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
