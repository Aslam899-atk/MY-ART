import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Home = () => {
    const { galleryItems } = useContext(AppContext);
    return (
        <div className="home-wrapper position-relative overflow-hidden w-100">
            {/* Banner Background */}
            <div className="position-absolute top-0 start-0 w-100 vh-100 z-n1 overflow-hidden">
                <img
                    src={`${import.meta.env.BASE_URL}banner.png`}
                    alt="Art Banner"
                    className="w-100 h-100 object-fit-cover"
                />
                <div className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.5), var(--bg-dark))' }}>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '12rem', minHeight: '100vh' }}>
                <section className="d-flex flex-column align-items-center text-center gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm"
                        style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.8rem', fontWeight: 'bold' }}
                    >
                        <Sparkles size={14} />
                        NEW COLLECTION DROP 2024
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="display-1 fw-bold mb-0"
                        style={{ lineHeight: 1.1 }}
                    >
                        Real <span style={{ color: 'var(--primary)' }}>Paintings,</span> <br /> Calligraphy & Pencil Art
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="lead mx-auto text-muted"
                        style={{ maxWidth: '600px' }}
                    >
                        Experience the authentic touch of handmade art.
                        From detailed pencil drawings to masterful calligraphy and oil paintings.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="d-flex gap-3 justify-content-center"
                    >
                        <Link to="/shop" className="btn btn-primary d-flex align-items-center gap-2 px-4 py-3 border-0">
                            Explore Gallery <ArrowRight size={18} />
                        </Link>
                        <button className="btn glass border-1 text-white px-4 py-3">
                            Learn More
                        </button>
                    </motion.div>
                </section>
            </div>

            <section className="container-fluid px-4 py-5 mt-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 px-lg-5 gap-3"
                >
                    <div>
                        <h2 className="display-4 fw-bold">Recent <span style={{ color: 'var(--primary)' }}>Masterpieces</span></h2>
                        <p className="text-muted mb-0">A glimpse into our latest creations.</p>
                    </div>
                    <Link to="/galleryView" className="text-primary fw-bold text-decoration-none hover-underline-animation">
                        View Full Gallery &rarr;
                    </Link>
                </motion.div>

                {/* 5-Column Grid Layout (PC: 5, Tab: 3, Phone: 2) */}
                <div className="row g-3 px-lg-5">
                    {galleryItems && galleryItems.slice(0, 5).map((item, index) => (
                        <div key={item.id} className="col-6 col-md-4 col-lg-custom-5">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="card glass border-0 h-100 overflow-hidden text-white"
                                style={{ height: '300px' }}
                            >
                                {item.type === 'video' ? (
                                    <video src={item.url} className="w-100 h-100 object-fit-cover" muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                                ) : (
                                    <img src={item.url} alt={item.title} className="w-100 h-100 object-fit-cover transition-transform duration-500 hover-zoom" />
                                )}
                            </motion.div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-5">
                    <Link to="/gallery" className="btn btn-outline-light px-5 py-3 rounded-pill">
                        View More to Gallery
                    </Link>
                </div>

                {/* Introduction Text */}
                <div className="container mt-5 pt-5 text-center">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h3 className="h2 fw-bold mb-4">Professional Artistry</h3>
                            <p className="text-muted lh-lg">
                                Welcome to Art Void, a sanctuary for authentic artistic expression.
                                We specialize in real, tangible art forms including detailed pencil sketches,
                                traditional oil paintings, and intricate calligraphy. Each piece is crafted
                                with passion and dedication, bringing imagination to life on canvas and paper.
                                Whether you are looking for a portrait, a landscape, or a custom commission,
                                we are dedicated to providing masterpieces that resonate with your soul.
                            </p>
                        </div>
                    </div>
                </div>

                <style>{`
                    @media (min-width: 992px) {
                        .col-lg-custom-5 {
                            flex: 0 0 auto;
                            width: 20%;
                        }
                    }
                `}</style>
            </section>
        </div>
    );
};

export default Home;
