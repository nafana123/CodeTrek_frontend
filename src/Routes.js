import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
import MainPage from "./Pages/MainPage/MainPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import Dashboard from "./Dashboard/Dashboard";
import { useLocation } from 'react-router-dom';

const AppRoutes = () => {
    const location = useLocation();
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
