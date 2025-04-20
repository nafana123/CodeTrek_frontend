import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaTasks, FaUserGraduate } from 'react-icons/fa';
import Sidebars from '../../Components/Sidebars/Sidebars';
import './Documentation.css';

const features = [
    { icon: <FaCode />, text: '8+ языков программирования' },
    { icon: <FaTasks />, text: '5 задач на разных уровнях сложности' },
    { icon: <FaUserGraduate />, text: 'Более 100 участников уже с нами' },
];


const descriptionBlocks = [
    "CodeTrek это обучающая платформа нового поколения, где ты можешь тренировать свои навыки программирования в удобном интерактивном формате. У нас ты найдешь множество задач, от простых до настоящих головоломок.",
    "Ты сам выбираешь свой путь обучения: можешь идти по возрастающей сложности, возвращаться к предыдущим задачам для закрепления или оттачивать мастерство, улучшая свои решения и подходы к ним.",
    "Выполнив задачу, ты увидишь, как её решили другие участники. Это поможет тебе узнать разные подходы, научиться писать более эффективный код и делиться своими знаниями с начинающими — ведь обучение становится сильнее через объяснение другим.",
];

const DocumentationPage = () => {
    return (
        <div className="documentation-container">
            <Sidebars visible={true} />

            <motion.h1
                className="documentation-title"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <span className="highlight-green">CodeTrek</span>
            </motion.h1>

            <div className="description-blocks">
                {descriptionBlocks.map((text, index) => (
                    <motion.div
                        key={index}
                        className={`description-item ${index % 2 === 0 ? 'left' : 'right'}`}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.6 + 0.5, duration: 0.8 }}
                    >
                        <p>
                            <span className="highlight-green">➤</span> {text.replace('CodeTrek — ', '')}
                        </p>

                    </motion.div>
                ))}
            </div>

            <div className="features-after-text">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        className="feature-block below"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (index + 1) * 0.6, duration: 0.6 }}
                    >
                        <div className="feature-icon-wrapper small">{feature.icon}</div>
                        <p className="feature-text">{feature.text}</p>
                    </motion.div>
                ))}
            </div>

            <div className="background-glow" />
        </div>
    );
};

export default DocumentationPage;
