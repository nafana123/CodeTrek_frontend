import React from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend as BarLegend } from 'recharts';

const drawerWidth = 240;

const dataPie = [
    { name: 'Задачи выполнены', value: 400 },
    { name: 'Задачи в процессе', value: 300 },
    { name: 'Задачи не начаты', value: 300 }
];

const dataBar = [
    { name: 'Пн', uv: 4000, pv: 2400 },
    { name: 'Вт', uv: 3000, pv: 1398 },
    { name: 'Ср', uv: 2000, pv: 9800 },
    { name: 'Чт', uv: 2780, pv: 3908 },
    { name: 'Пт', uv: 1890, pv: 4800 }
];

const AdminPanel = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Админ-панель
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}>
                <Toolbar />
                <List>
                    <ListItem button>
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Главная" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><PeopleIcon /></ListItemIcon>
                        <ListItemText primary="Пользователи" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><AssignmentIcon /></ListItemIcon>
                        <ListItemText primary="Задачи" />
                    </ListItem>
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                <Typography variant="h4">Добро пожаловать, Админ!</Typography>
                <Typography>Здесь ты можешь управлять пользователями, задачами и статистикой.</Typography>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-around' }}>
                    <ResponsiveContainer width="45%" height={300}>
                        <PieChart>
                            <Pie data={dataPie} dataKey="value" nameKey="name" outerRadius={120} label>
                                <Cell fill="#82ca9d" />
                                <Cell fill="#8884d8" />
                                <Cell fill="#ff7300" />
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>

                    <ResponsiveContainer width="45%" height={300}>
                        <BarChart data={dataBar}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <BarLegend />
                            <Bar dataKey="uv" fill="#8884d8" />
                            <Bar dataKey="pv" fill="#82ca9d" />
                            <BarTooltip />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminPanel;
