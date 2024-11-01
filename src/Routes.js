import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import Dashboard from "./Dashboard/Dashboard";

const AppRoutes = () => {
    const isAuthenticated = () => {
        return !!localStorage.getItem('token');
    };

    return (
        <Routes>
            {!isAuthenticated() ? (
                <>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
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
