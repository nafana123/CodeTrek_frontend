import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
import MainPage from "./Pages/MainPage/MainPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AllTasks from "./Pages/allTasks/AllTasks";
import Task from "./Pages/Task/Task";
import TaskSolution from "./Pages/TaskSolution/TaskSolution";

const AppRoutes = ({ user, setUser }) => {
    const isAuthenticated = () => {
        return !!localStorage.getItem('token');
    };

    return (
        <Routes>
            {!isAuthenticated() ? (
                <>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/register" element={<RegisterPage  setUser={setUser}/>} />
                    <Route path="/login" element={<LoginPage setUser={setUser} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </>
            ) : (
                <>
                    <Route path="/dashboard" element={<Dashboard  user={user}  />} />
                    <Route path="/task/:id/:language" element={<Task />} />
                    <Route path="/task/solution/:id/:language" element={<TaskSolution />} />
                    <Route path="/all/tasks" element={<AllTasks  user={user}  />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </>
            )}
        </Routes>
    );
};

export default AppRoutes;
