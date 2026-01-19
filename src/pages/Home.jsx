import React, { useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Sparkles, Terminal, ChevronRight, Palette, Image as ImageIcon, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    useEffect(() => {
        // isLoaded was unused, but if we want to trigger something on load we can keep it
        // or just remove it if not needed. Removing for lint cleanliness.
    }, []);

    const projects = [
        {
            title: "Pencil Sketch Collection",
            category: "Traditional Art • Realism",
            description: "A deep dive into hyper-realistic portraits and architectural sketches using premium graphite and charcoal. Each piece captures intricate details and emotional depth on fine-grain paper.",
            tags: ["Graphite", "Charcoal", "Realism", "Portraits"],
            link: "/gallery",
            github: "https://github.com/Aslam899-atk/MY-ART",
            image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
            featured: true
        },
        {
            title: "Calligraphy",
            category: "Script • Traditional Art",
            description: "Intricate calligraphic works exploring the beauty of letterforms and traditional ink techniques.",
            tags: ["Calligraphy", "Inking", "Script", "Traditional"],
            link: "/gallery",
            github: "https://github.com/Aslam899-atk",
            image: "https://i.pinimg.com/originals/5b/3b/25/5b3b257121b5268013241276741f5109.jpg"
        },
        {
            title: "Painting",
            category: "Canvas • Traditional",
            description: "Handcrafted paintings exploring diverse themes with vibrant colors and expressive techniques.",
            tags: ["Oil Paint", "Acrylic", "Canvas", "Fine Art"],
            link: "/gallery",
            github: "https://github.com/Aslam899-atk",
            image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80"
        }
    ];

    const skills = [
        { name: "Pencil Art", icons: [<Palette size={24} />], tech: ["Graphite", "Charcoal", "Hatching", "Realism"] },
        { name: "Detailed Calligraphy", icons: [<ImageIcon size={24} />], tech: ["Copperplate", "Italic", "Inking", "Script"] },
        { name: "Ink Art", icons: [<ArrowRight size={24} />], tech: ["Stippling", "Cross-hatching", "Inking", "Pen & Ink"] },
        { name: "Digital Art", icons: [<Code2 size={24} />], tech: ["Concept Art", "Illustrations", "Commissions", "Retouching"] }
    ];

    return (
        <div className="portfolio-root bg-dark text-white overflow-hidden">
            {/* Background Glows */}
            <div className="position-fixed top-0 start-0 w-100 h-100 pointer-events-none" style={{ zIndex: 0 }}>
                <div className="position-absolute top-10 start-10 bg-primary opacity-10 rounded-circle blur-3xl" style={{ width: '40vw', height: '40vw' }}></div>
                <div className="position-absolute bottom-10 end-10 bg-accent opacity-5 rounded-circle blur-3xl" style={{ width: '30vw', height: '30vw' }}></div>
            </div>

            {/* HERO SECTION */}
            <section className="min-vh-100 d-flex align-items-center position-relative pt-5">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-7">
                            <Motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill glass mb-4 border-0">
                                    <Sparkles size={16} className="text-primary" />
                                    <span className="small fw-bold letter-spacing-2 opacity-75">OPEN FOR CUSTOM COMMISSIONS</span>
                                </div>
                                <h1 className="display-1 fw-bold mb-4 font-heading">
                                    Our Creative <span className="text-gradient">Masterpieces</span>.
                                </h1>
                                <p className="lead text-muted mb-5 pe-lg-5" style={{ fontSize: '1.25rem', lineHeight: '1.8' }}>
                                    Welcome to <span className="text-white fw-bold">ART VOID</span>, where we specialize in detailed pencil sketches and expressive paintings crafted with soul.
                                </p>
                                <div className="d-flex flex-wrap gap-3">
                                    <Link to="/contact" className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold border-0 shadow-glow">
                                        Commission Artwork <ArrowRight size={20} className="ms-2" />
                                    </Link>
                                    <Link to="/gallery" className="btn glass btn-lg rounded-pill px-5 py-3 fw-bold border-0 text-white">
                                        Explore Gallery
                                    </Link>
                                </div>
                            </Motion.div>
                        </div>
                        <div className="col-lg-5 d-none d-lg-block">
                            <Motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="position-relative"
                            >
                                <div className="glass rounded-4 p-2 border-0 rotate-3 shadow-2xl overflow-hidden position-relative">
                                    <img
                                        src="/banner.png"
                                        alt="ART VOID Masterpiece"
                                        className="w-100 rounded-4 shadow-lg"
                                        style={{ objectFit: 'cover', height: '400px' }}
                                    />
                                    <div className="position-absolute bottom-0 start-0 w-100 p-4 bg-gradient-to-t from-dark text-white">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <Sparkles size={14} className="text-primary" />
                                            <span className="extra-small fw-bold text-uppercase tracking-widest">Featured Artwork</span>
                                        </div>
                                        <h5 className="fw-bold mb-0">The Creative Sanctuary</h5>
                                    </div>
                                </div>
                                <div className="position-absolute -bottom-10 -start-10 glass p-3 rounded-4 border-0 -rotate-6 shadow-xl">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-success rounded-circle" style={{ width: 12, height: 12 }}></div>
                                        <span className="small fw-bold">Accepting Orders Worldwide</span>
                                    </div>
                                </div>
                            </Motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED PROJECTS */}
            <section className="py-10 position-relative">
                <div className="container">
                    <header className="mb-10">
                        <div className="text-primary fw-bold small text-uppercase mb-2 tracking-widest">Masterpieces</div>
                        <h2 className="display-4 fw-bold mb-0">Artistic <span className="text-gradient">Collections</span></h2>
                    </header>

                    <div className="row g-5">
                        {projects.map((project, idx) => (
                            <div key={idx} className={project.featured ? "col-12" : "col-lg-6"}>
                                <Motion.div
                                    whileHover={{ y: -10 }}
                                    className="glass rounded-5 overflow-hidden border-0 h-100 group position-relative"
                                >
                                    <div className="row g-0 h-100">
                                        <div className={project.featured ? "col-lg-7" : "col-12"}>
                                            <div className="position-relative h-100" style={{ minHeight: '300px' }}>
                                                <img src={project.image} alt={project.title} className="w-100 h-100 object-fit-cover transition-all duration-700 group-hover-scale" />
                                                <div className="position-absolute top-0 start-0 m-4">
                                                    <span className="glass px-3 py-1 rounded-pill small fw-bold text-white border-0">{project.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={project.featured ? "col-lg-5" : "col-12"}>
                                            <div className="p-5 d-flex flex-column h-100">
                                                <h3 className="h2 fw-bold mb-3">{project.title}</h3>
                                                <p className="text-muted mb-4 flex-grow-1">{project.description}</p>
                                                <div className="d-flex flex-wrap gap-2 mb-5">
                                                    {project.tags.map(tag => (
                                                        <span key={tag} className="small px-2 py-1 rounded bg-white bg-opacity-5 text-primary fw-bold">{tag}</span>
                                                    ))}
                                                </div>
                                                <div className="d-flex gap-4 align-items-center">
                                                    <Link to="/gallery" className="text-white text-decoration-none fw-bold hover-text-primary d-flex align-items-center gap-2">
                                                        View Items <ChevronRight size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SKILLS MATRIX */}
            <section className="py-10 bg-white bg-opacity-5">
                <div className="container text-center">
                    <header className="mb-10 mx-auto" style={{ maxWidth: '600px' }}>
                        <h2 className="display-4 fw-bold mb-4">Artistic <span className="text-gradient">Mediums</span></h2>
                        <p className="text-muted">Specialized techniques honed to bring imagination to life on paper and canvas.</p>
                    </header>

                    <div className="row g-4">
                        {skills.map((skill, idx) => (
                            <div key={idx} className="col-md-6 col-lg-3">
                                <Motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="glass p-5 rounded-4 h-100 border-0"
                                >
                                    <div className="text-primary mb-4 d-flex justify-content-center">{skill.icons}</div>
                                    <h4 className="fw-bold mb-3">{skill.name}</h4>
                                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                                        {skill.tech.map(t => (
                                            <span key={t} className="small opacity-50 fw-semibold">{t}</span>
                                        ))}
                                    </div>
                                </Motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRUST SIGNALS */}
            <section className="py-10">
                <div className="container">
                    <div className="glass p-5 p-lg-10 rounded-5 border-0 position-relative overflow-hidden">
                        <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
                            <div className="col-lg-8">
                                <h2 className="display-5 fw-bold mb-4">Commission your next <span className="text-gradient">Masterpiece</span>.</h2>
                                <p className="lead text-muted mb-5">Whether it is a detailed portrait, a landscape, or a custom painting, we are dedicated to providing art that resonates with your soul.</p>
                                <div className="d-flex flex-wrap gap-4">
                                    <Link to="/contact" className="btn btn-primary rounded-pill px-5 py-3 fw-bold border-0 shadow-glow">
                                        Send an Inquiry
                                    </Link>
                                    <div className="d-flex gap-3 align-items-center">
                                        <a href="https://t.me/aslamtk35" className="text-white opacity-50 hover-opacity-100 transition-all"><Terminal size={24} /></a>
                                        <a href="https://www.instagram.com/aslamtk35" className="text-white opacity-50 hover-opacity-100 transition-all"><ImageIcon size={24} /></a>
                                        <a href="mailto:aslamtk35@gmail.com" className="text-white opacity-50 hover-opacity-100 transition-all"><Mail size={24} /></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 text-center mt-5 mt-lg-0">
                                <div className="display-1 fw-bold text-primary mb-0">50+</div>
                                <div className="h5 fw-bold text-uppercase opacity-50 tracking-widest">Global Clients</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-5 border-top border-white border-opacity-5">
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-muted small">
                    <div>© {new Date().getFullYear()} ART VOID.</div>
                    <div className="d-flex gap-4">
                        <Link to="/gallery" className="text-decoration-none hover-text-white transition-all">Projects</Link>
                        <Link to="/shop" className="text-decoration-none hover-text-white transition-all">Studio</Link>
                        <Link to="/contact" className="text-decoration-none hover-text-white transition-all">Hire</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
