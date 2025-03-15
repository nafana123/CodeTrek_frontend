import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Paginator } from "primereact/paginator";
import axiosInstance from '../../axiosInstance';
import './UserDetails.css'
import { dracula } from "@uiw/codemirror-theme-dracula";
import { php } from "@codemirror/lang-php";
import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";

const COLORS = ['#3DFF00', '#2A7A00', '#00FF00', '#C5C6C7', '#E0E0E0'];

const UserDetails = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [languageStats, setLanguageStats] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const tasksPerPage = 3;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(`/admin/user/${id}/info`);
                setUserData(response.data);

                const languageCount = {};
                response.data.tasks.forEach(taskData => {
                    const language = taskData.language || 'Неизвестно';
                    languageCount[language] = (languageCount[language] || 0) + 1;
                });

                setLanguageStats(Object.entries(languageCount).map(([name, value]) => ({ name, value })));
            } catch (error) {
                console.error("Ошибка при загрузке данных пользователя:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [id]);

    if (loading) return <Typography>Загрузка...</Typography>;
    if (!userData) return <Typography>Нет данных о пользователе</Typography>;

    const renderStars = (level) => {
        let stars = [];
        for (let i = 0; i < level; i++) {
            stars.push(<span key={i} className="star">★</span>);
        }
        return stars;
    };

    const filteredTasks = userData.tasks.filter(taskData => !selectedLanguage || taskData.language === selectedLanguage);
    const paginatedTasks = filteredTasks.slice(currentPage * tasksPerPage, (currentPage + 1) * tasksPerPage);

    return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
            <Grid container spacing={1} alignItems="center" justifyContent="center">
                <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 20, gap: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {userData.user?.login || 'Неизвестно'} &nbsp; | &nbsp; {userData.user?.email || 'Неизвестно'} &nbsp; | &nbsp; Дата регистрации: {userData.user?.data || 'Неизвестно'}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', ml: -40 }}>
                    {languageStats.length > 0 && (
                        <PieChart width={300} height={250}>
                            <Pie
                                data={languageStats}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label
                                onClick={(data) => setSelectedLanguage(data.name)}
                            >
                                {languageStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    )}
                </Grid>
            </Grid>
            {filteredTasks.length === 0 ? (
                <Typography
                    variant="h4"
                    sx={{
                        mt: 4,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 'calc(100vh - 200px)', // Adjust this value based on your layout
                        textAlign: 'center'
                    }}
                >
                    У пользователя нет решённых задач
                </Typography>
            ) : (
                <Grid container spacing={2} mt={3} justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <Typography variant="h5" gutterBottom textAlign="center">Решенные задачи</Typography>
                        {paginatedTasks.map((taskData, index) => (
                            taskData.task && (
                                <Box key={index} sx={{
                                    mb: 2,
                                    p: 2,
                                    border: '1px solid #ccc',
                                    borderRadius: 2,
                                    textAlign: 'left',
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': { transform: 'scale(1.05)' }
                                }}>
                                    <Typography variant="h6">Задача: {taskData.task?.title || 'Нет названия'}</Typography>
                                    <Typography>Описание: {taskData.task?.description || 'Нет описания'}</Typography>
                                    <Typography>Язык: {taskData.language || 'Неизвестно'}</Typography>
                                    <Typography>Сложность: {renderStars(taskData.task.difficulty?.level || 0)}</Typography>
                                    <Typography>Входные данные: {taskData.task?.input || 'Нет данных'}</Typography>
                                    <Typography>Выходные данные: {taskData.task?.output || 'Нет данных'}</Typography>
                                    <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Решение:</Typography>
                                    <CodeMirror
                                        value={taskData.solvedTask || 'Нет решения'}
                                        theme={dracula}
                                        extensions={[
                                            taskData.language === 'php' ? php() : javascript({ jsx: true })
                                        ]}
                                        editable={false}
                                    />
                                </Box>
                            )
                        ))}
                        <Paginator
                            first={currentPage * tasksPerPage}
                            rows={tasksPerPage}
                            totalRecords={filteredTasks.length}
                            onPageChange={(e) => setCurrentPage(e.page)}
                        />
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default UserDetails;
