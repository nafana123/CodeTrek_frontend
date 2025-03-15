import React, { useEffect, useState } from 'react';
import { CssBaseline, Box, Card, CardContent, Typography, Button } from '@mui/material';
import { Paginator } from "primereact/paginator";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
    AreaChart,
    Area
} from 'recharts';

const AdminPanel = () => {
    const [data, setData] = useState([]);
    const [userStats, setUserStats] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showAllUsers, setShowAllUsers] = useState(false);
    const [searchEmail, setSearchEmail] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const usersPerPage = 20;
    const navigate = useNavigate();


    const groupByDate = (users) => {
        const grouped = users.reduce((acc, user) => {
            const date = user.data;
            if (!acc[date]) acc[date] = [];
            acc[date].push(user);
            return acc;
        }, {});
        return Object.keys(grouped).map(date => ({
            name: date,
            users: grouped[date].length
        }));
    };

    useEffect(() => {
        const fetchUserStatistics = async () => {
            try {
                const response = await axiosInstance.get('/admin/user/all');
                setUsers(response.data);
                setUserStats(groupByDate(response.data));
            } catch (error) {
                console.error("Ошибка при загрузке пользователей:", error);
            }
        };
        fetchUserStatistics();
    }, []);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axiosInstance.get('/admin/task/statistics');
                setData(Object.keys(response.data).map(key => ({
                    name: key,
                    tasks: response.data[key]
                })));
            } catch (error) {
                console.error("Ошибка при загрузке статистики задач:", error);
            }
        };
        fetchStatistics();
    }, []);

    const handleChartClick = (e) => {
        if (e && e.activeLabel) {
            setSelectedDate(e.activeLabel);
            setShowAllUsers(false);
            setCurrentPage(0);
        }
    };

    const filteredUsers = users.filter(user =>
        (!selectedDate || user.data === selectedDate) &&
        user.email.toLowerCase().includes(searchEmail.toLowerCase())
    );

    const currentUsers = filteredUsers.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);

    return (
        <Box className="main-section" sx={{ display: 'flex' }}>
            <CssBaseline />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 3 }}>
                <Typography variant="h6">Статистика решенных задач по языкам</Typography>
                <ResponsiveContainer width="97%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="tasks" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>

                <Typography variant="h6" sx={{ mt: 3 }}>Статистика регистрации пользователей</Typography>
                <Button onClick={() => { setShowAllUsers(!showAllUsers); setSelectedDate(null); setCurrentPage(0); }} sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    Общее количество пользователей: {users.length}
                </Button>
                <ResponsiveContainer width="97%" height={300}>
                    <AreaChart data={userStats} onClick={handleChartClick}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="users" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                </ResponsiveContainer>

                {(selectedDate || showAllUsers) && (
                    <Box sx={{mt: 3}}>
                        <Typography
                            variant="h6">{selectedDate ? `Пользователи, зарегистрированные ${selectedDate}` : "Все пользователи"}</Typography>

                        <input
                            type="text"
                            placeholder="Поиск по email"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            className="adminInput"
                        />

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, mt: 2 }}>
                            {currentUsers.length > 0 ? currentUsers.map(user => (
                                <Card
                                    key={user.id}
                                    sx={{
                                        minWidth: 250,
                                        p: 2,
                                        background: '#f5f5f5',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': { transform: 'scale(1.05)' }
                                    }}
                                    onClick={() => navigate(`/admin/user/${user.id}`)}
                                >
                                    <CardContent>
                                        <Typography variant="h6">{user.login}</Typography>
                                        <Typography>Email: {user.email}</Typography>
                                        <Typography>Дата регистрации: {user.data}</Typography>
                                    </CardContent>
                                </Card>

                            )) : <Typography>Пользователь не найден.</Typography>}
                        </Box>
                        <Paginator
                            first={currentPage * usersPerPage}
                            rows={usersPerPage}
                            totalRecords={filteredUsers.length}
                            onPageChange={(e) => setCurrentPage(e.page)}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default AdminPanel;
