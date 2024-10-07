import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './components/RegisterPage/RegisterPage';
import MainSection from "./components/MainSection/MainSection";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainSection />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
    );
};

export default AppRoutes;
