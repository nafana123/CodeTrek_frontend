import React, { useState } from 'react';
import Header from './components/Header/Header';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes';
import Footer from "./components/Footer/Footer";

function App() {
    const [user, setUser] = useState(null);

    const handleUserRegistered = (userData) => {
        setUser(userData);
    };

    return (
        <div className="App">
            <Router>
                <Header user={user} />
                <AppRoutes onUserRegistered={handleUserRegistered} />
                <Footer />
            </Router>
        </div>
    );
}

export default App;
