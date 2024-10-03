import React from 'react';
import MainSection from './components/MainSection/MainSection';
import Header from './components/Header/Header';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';



function App() {
  return (
      <div className="App">
        <Header />
        <MainSection />
      </div>
  );
}

export default App;