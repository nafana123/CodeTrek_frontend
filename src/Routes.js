import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
import MainPage from "./Pages/MainPage/MainPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AllTasks from "./Pages/allTasks/AllTasks";
import Task from "./Pages/Task/Task";
import TaskSolution from "./Pages/TaskSolution/TaskSolution";
import Profile from "./Pages/Profile/Profile";
import Leaderboard from "./Pages/Leaderboard/Leaderboard";
import TaskDetails from "./Pages/TaskDetails/TaskDetails";
import AdminPanel from "./Pages/AdminPanel/AdminPanel";
import UserDetails from "./Pages/AdminPanel/UserDetails";
import DocumentationPage from "./Pages/Documentation/DocumentationPage";

const AppRoutes = ({ user, setUser }) => {
    const isAuthenticated = () => !!localStorage.getItem('token');
    const isAdmin = () => user && user.roles && user.roles.includes('ROLE_ADMIN');

    return (
        <Routes>
            {!isAuthenticated() ? (
                <>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/register" element={<RegisterPage setUser={setUser} />} />
                    <Route path="/login" element={<LoginPage setUser={setUser} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </>
            ) : isAdmin() ? (
                <>
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/admin/user/:id" element={<UserDetails />} />
                    <Route path="*" element={<Navigate to="/admin" />} />
                </>
            ) : (
                <>
                    <Route path="/dashboard" element={<Dashboard user={user} />} />
                    <Route path="/task/:id/:language" element={<Task />} />
                    <Route path="/task/solution/:id/:language" element={<TaskSolution />} />
                    <Route path="/all/tasks" element={<AllTasks user={user} />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/details/task/:id" element={<TaskDetails />} />
                    <Route path="/documentation" element={<DocumentationPage />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </>
            )}
        </Routes>
    );
};

export default AppRoutes;
