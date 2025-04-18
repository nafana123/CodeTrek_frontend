import React, { useEffect, useState } from "react";
import Sidebars from "../../Components/Sidebars/Sidebars";
import axiosInstance from "../../axiosInstance";
import { Timeline } from 'primereact/timeline';
import { Paginator } from "primereact/paginator";
import { motion } from "framer-motion";
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./Leaderboard.css";

const Leaderboard = () => {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [leaders, setLeaders] = useState([]);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);

    const getLeaders = async () => {
        try {
            const response = await axiosInstance.get(`/leaderboard`);
            const sortedLeaders = response.data.sort((a, b) => b.points - a.points);
            setLeaders(sortedLeaders);
        } catch (error) {
            console.error("Ошибка при получении списка лидеров:", error);
        }
    };

    useEffect(() => {
        getLeaders();
    }, []);

    const onPageChange = (event) => {
        setPage(event.page);
        setRows(event.rows);
    };

    const displayedLeaders = leaders.slice(page * rows, (page + 1) * rows);

    const getRankStyle = (rank) => {
        switch (rank) {
            case 0:
                return { background: 'gold', color: '#000' };
            case 1:
                return { background: 'silver', color: '#000' };
            case 2:
                return { background: '#cd7f32', color: '#000' }; // bronze
            default:
                return { background: '#00FF00', color: '#000' };
        }
    };

    const customizedMarker = (item, index) => {
        const rank = page * rows + index;
        const style = getRankStyle(rank);
        return (
            <motion.div
                className="custom-marker"
                style={style}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
            >
                {rank + 1}
            </motion.div>
        );
    };

    const customizedContent = (item, index) => {
        const isRight = index % 2 !== 0;
        const rank = page * rows + index;

        return (
            <motion.div
                className={`timeline-content compact-content ${isRight ? "align-right" : "align-left"} ${rank < 3 ? `top-${rank + 1}` : ""}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
            >
                {rank === 0 && (
                    <motion.div
                        className="crown"
                        initial={{ y: -20, opacity: 0, rotate: -10 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        👑
                    </motion.div>
                )}
                <div className="login">{item.user.login}</div>
                <div className="points">{item.points} очков</div>
            </motion.div>
        );
    };

    return (
        <div className="leaderboard-container">
            <Sidebars visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />
            <div className="leaderboard-content">
                <h1 className="title-leader">Список лидеров</h1>
                {leaders.length > 0 ? (
                    <>
                        <Timeline
                            value={displayedLeaders}
                            align="alternate"
                            marker={(item, i) => customizedMarker(item, i)}
                            content={(item, i) => customizedContent(item, i)}
                        />
                        <Paginator
                            first={page * rows}
                            rows={rows}
                            totalRecords={leaders.length}
                            onPageChange={onPageChange}
                        />
                    </>
                ) : (
                    <p>Загрузка...</p>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
