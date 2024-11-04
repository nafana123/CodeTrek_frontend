import React, { useEffect, useState } from 'react';
import axiosInstance from "../axiosInstance";
import { Card } from 'primereact/card';
import Sidebars from '../components/Sidebars/Sidebars';
import './Dashboard.css';

const Dashboard = () => {
    const [languages, setLanguages] = useState([]);
    const [difficultyLevels, setDifficultyLevels] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || '');
    const [selectedDifficulty, setSelectedDifficulty] = useState(localStorage.getItem('selectedDifficulty') || '');
    const [tasks, setTasks] = useState([]);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    useEffect(() => {
        const fetchLanguagesAndDifficulties = async () => {
            try {
                const response = await axiosInstance.get('/languages-and-difficulties');
                setLanguages(response.data.languages);
                setDifficultyLevels(response.data.difficulties);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };

        fetchLanguagesAndDifficulties();
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            if (selectedLanguage && selectedDifficulty) {
                try {
                    const response = await axiosInstance.get('/tasks', {
                        params: {
                            language_id: selectedLanguage,
                            difficulty_id: selectedDifficulty,
                        },
                    });
                    setTasks(response.data);
                } catch (error) {
                    console.error('Ошибка при загрузке задач:', error);
                }
            }
        };

        fetchTasks();
    }, [selectedLanguage, selectedDifficulty]);

    const handleLanguageChange = (e) => {
        const language = e.target.value;
        setSelectedLanguage(language);
        localStorage.setItem('selectedLanguage', language);
    };

    const handleDifficultyChange = (e) => {
        const difficulty = e.target.value;
        setSelectedDifficulty(difficulty);
        localStorage.setItem('selectedDifficulty', difficulty);
    };

    return (
        <div className="dashboard">
            <div className="selectors">
                <select value={selectedLanguage} onChange={handleLanguageChange}>
                    <option value="">Выберите язык</option>
                    {languages.map(language => (
                        <option key={language.id} value={language.id}>
                            {language.name}
                        </option>
                    ))}
                </select>

                <select value={selectedDifficulty} onChange={handleDifficultyChange}>
                    <option value="">Выберите сложность</option>
                    {difficultyLevels.map(level => (
                        <option key={level.id} value={level.id}>
                            {level.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="tasks">
                <h2>Задачи:</h2>
                {tasks.map(task => (
                    <Card key={task.id} title={task.title}>
                        <p className="m-0">{task.description}</p>
                    </Card>
                ))}
            </div>

            <Sidebars visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />
        </div>
    );
};

export default Dashboard;
