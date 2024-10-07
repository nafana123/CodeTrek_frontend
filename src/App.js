import React from 'react';
import Header from './components/Header/Header';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes';



function App() {
  return (
      <div className="App">
          <Router>
          <Header />
              <AppRoutes />
          </Router>

      </div>
  );
}

export default App;