import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
import MainPage from "./Pages/MainPage/MainPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import Dashboard from "./Dashboard/Dashboard";

const AppRoutes = ({ setUser }) => {
    const isAuthenticated = () => {
        return !!localStorage.getItem('token');
    };

    return (
        <Routes>
            {!isAuthenticated() ? (
                <>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage setUser={setUser} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </>
            ) : (
                <>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </>
            )}
        </Routes>
    );
};

export default AppRoutes;
