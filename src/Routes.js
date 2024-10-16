import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import MainSection from "./components/MainSection/MainSection";
import LoginPage from "./pages/LoginPage/LoginPage";
import Dashboard from "./Dashboard/Dashboard";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainSection />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />


        </Routes>
    );
};

export default AppRoutes;
