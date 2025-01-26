import React, { useState, useEffect } from 'react';
import Header from './Components/Header/Header';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes';
import Footer from "./Components/Footer/Footer";
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
    
    return (
        <div className="App">
            <Router>
                <Header user={user} setUser={setUser} />
                <AppRoutes setUser={setUser} />
                <Footer />
            </Router>
        </div>
    );
}

export default App;
