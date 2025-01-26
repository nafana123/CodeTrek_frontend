import React from "react";
import './Footer.css';

const Footer = () => {
    return (
        <footer className="text-center text-lg-start footer-bg text-light">
            <section className="d-flex border-bottom">
                <div className="container text-center text-md-start mt-5">
                    <div className="row mt-3">
                        <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                <i className="fas fa-code me-3"></i>CodeTrek
                            </h6>
                            <p>
                                CodeTrek — это платформа для разработчиков, где вы можете улучшать свои навыки программирования, решая задачи и создавая проекты.
                            </p>
                        </div>
                        <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Языки</h6>
                            <p>
                                <a href="#javascript" className="text-reset">JavaScript</a>
                            </p>
                            <p>
                                <a href="#php" className="text-reset">PHP</a>
                            </p>
                            <p>
                                <a href="#java" className="text-reset">Java</a>
                            </p>
                            <p>
                                <a href="#csharp" className="text-reset">C#</a>
                            </p>
                        </div>
                        <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Информация</h6>
                            <p>
                                <a href="#projects" className="text-reset">Проекты</a>
                            </p>
                            <p>
                                <a href="#about" className="text-reset">О нас</a>
                            </p>
                            <p>
                                <a href="#faq" className="text-reset">Частые вопросы</a>
                            </p>
                            <p>
                                <a href="#contact" className="text-reset">Контакты</a>
                            </p>
                        </div>

                        <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Контакты</h6>
                            <p><i className="fas fa-home me-3"></i>Магнитогорск, ул. Ленина, 10</p>
                            <p>
                                <i className="fas fa-envelope me-3"></i>
                                info@codetrek.com
                            </p>
                            <p><i className="fas fa-phone me-3"></i> +7 495 000 00 00</p>
                            <p><i className="fas fa-print me-3"></i> +7 495 000 00 01</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="text-center p-4 footer-bg-dark text-light">
                <p>&copy; {new Date().getFullYear()} CodeTrek. Все права защищены.</p>
            </div>
        </footer>
    );
};

export default Footer;
