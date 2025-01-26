import React, { useEffect, useState } from "react";
import Sidebars from "../../Components/Sidebars/Sidebars";
import axiosInstance from "../../axiosInstance";
import { Paginator } from "primereact/paginator";
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

    return (
        <div className="leaderboard-container">
            <Sidebars visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />
            <div className="leaderboard-content">
                <h1 className="title">Лидеры</h1>

                {leaders.length > 0 ? (
                    <div className="podium-container">
                        <div className="podium">
                            {leaders[1] && (
                                <div className="podium-position second">
                                    <div className="podium-user">{leaders[1].user.login}</div>
                                    <div className="podium-rank">2</div>
                                    <div className="podium-points">{leaders[1].points} очков</div>
                                </div>
                            )}

                            {leaders[0] && (
                                <div className="podium-position first">
                                    <div className="podium-user">{leaders[0].user.login}</div>
                                    <div className="podium-rank">1</div>
                                    <div className="podium-points">{leaders[0].points} очков</div>
                                </div>
                            )}

                            {leaders[2] && (
                                <div className="podium-position third">
                                    <div className="podium-user">{leaders[2].user.login}</div>
                                    <div className="podium-rank">3</div>
                                    <div className="podium-points">{leaders[2].points} очков</div>
                                </div>
                            )}
                        </div>

                        <div className="others">
                            <ul className="leader-list">
                                {displayedLeaders.slice(3).map((leader, index) => (
                                    <li key={leader.id} className="leader-item">
                                        <span className="leader-rank">{index + 4}.</span>
                                        <span className="leader-login">{leader.user.login}</span>
                                        <span className="leader-points">{leader.points} очков</span>
                                    </li>
                                ))}
                            </ul>
                            <Paginator
                                first={page * rows}
                                rows={rows}
                                totalRecords={leaders.length}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                ) : (
                    <p>Загрузка списка лидеров...</p>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
