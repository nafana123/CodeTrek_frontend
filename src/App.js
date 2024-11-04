import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes';
import Footer from "./components/Footer/Footer";
import { jwtDecode } from 'jwt-decode';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
            } catch (error) {
                console.error('Недействительный токен:', error);
            }
        }
    }, []);

    const handleUserRegistered = (userData) => {
        setUser(userData);
    };

    return (
        <div className="App">
            <Router>
                <Header user={user} />
                <AppRoutes setUser={setUser} />
                <Footer />
            </Router>
        </div>
    );
}

export default App;
