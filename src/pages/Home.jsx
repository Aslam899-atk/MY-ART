import React, { useEffect, useContext, useMemo } from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, Mail, Sparkles, Send, ChevronRight, Palette, Instagram, Code2, PenTool, Brush } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ItemPreview from '../components/ItemPreview';

const Home = () => {
    const { galleryItems, toggleGalleryLike, toggleLike, likedIds } = useContext(AppContext);
    const [selectedItem, setSelectedItem] = React.useState(null);

    const featuredGallery = useMemo(() => {
        return [...galleryItems]
            .sort((a, b) => (b.likes || 0) - (a.likes || 0))
            .slice(0, 5);
    }, [galleryItems]);



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
        { name: "Pencil Drawing", icons: [<Palette size={24} />], tech: ["Graphite", "Charcoal", "Hatching", "Realism"] },
        { name: "Calligraphy", icons: [<PenTool size={24} />], tech: ["Copperplate", "Italic", "Inking", "Script"] },
        { name: "Painting", icons: [<Brush size={24} />], tech: ["Oil Paint", "Acrylic", "Canvas", "Fine Art"] },
        { name: "Other Mediums", icons: [<Sparkles size={24} />], tech: ["Ink Art", "Digital Art", "Mixed Media", "Custom"] }
    ];

    return (
        <div className="portfolio-root bg-dark text-white overflow-hidden">
            {/* Background Glows */}
            <div className="position-fixed top-0 start-0 w-100 h-100 pointer-events-none" style={{ zIndex: 0 }}>
                <div className="position-absolute bottom-10 end-10 bg-accent opacity-10 rounded-circle blur-3xl" style={{ width: '30vw', height: '30vw' }}></div>
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
                                <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
                                    <div className="carousel-inner glass rounded-4 p-2 border-0 rotate-3 shadow-2xl overflow-hidden">
                                        {(featuredGallery.length > 0 ? featuredGallery : projects).map((item, index) => (
                                            <div
                                                key={index}
                                                className={`carousel-item ${index === 0 ? 'active' : ''}`}
                                                data-bs-interval="3000"
                                                onClick={() => setSelectedItem(item)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <img
                                                    src={item.url || item.image}
                                                    className="d-block w-100 rounded-4"
                                                    alt={item.title}
                                                    style={{ objectFit: 'cover', height: '400px' }}
                                                />
                                                <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-4 p-3 mb-2 mx-2">
                                                    <div className="d-flex align-items-center gap-2 mb-1 justify-content-center">
                                                        <Sparkles size={14} className="text-primary" />
                                                        <span className="extra-small fw-bold text-uppercase tracking-widest">Featured Collection</span>
                                                    </div>
                                                    <h5 className="fw-bold mb-0">{item.title}</h5>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Next</span>
                                    </button>
                                </div>

                                <div className="position-absolute -bottom-10 -start-10 glass p-3 rounded-4 border-0 -rotate-6 shadow-xl" style={{ zIndex: 10 }}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-success rounded-circle animate-pulse" style={{ width: 12, height: 12 }}></div>
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
                                                <img src={project.image} alt={project.title} loading="lazy" className="w-100 h-100 object-fit-cover transition-all duration-700 group-hover-scale" />
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
            <section className="py-10" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div className="container text-center">
                    <header className="mb-10 mx-auto" style={{ maxWidth: '600px' }}>
                        <h2 className="display-4 fw-bold mb-4">Artistic <span className="text-gradient">Mediums</span></h2>
                        <p className="text-white-50">Specialized techniques honed to bring imagination to life on paper and canvas.</p>
                    </header>

                    <div className="row g-4">
                        {skills.map((skill, idx) => (
                            <div key={idx} className="col-md-6 col-lg-3">
                                <Motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="card glass p-5 rounded-4 h-100 border-0"
                                >
                                    <div className="text-primary mb-4 d-flex justify-content-center">{skill.icons}</div>
                                    <h4 className="fw-bold mb-3">{skill.name}</h4>
                                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                                        {skill.tech.map(t => (
                                            <span key={t} className="small opacity-75 fw-semibold">{t}</span>
                                        ))}
                                    </div>
                                </Motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-10">
                <div className="container">
                    <header className="mb-8 text-center">
                        <h2 className="display-4 fw-bold mb-4">Common <span className="text-gradient">Inquiries</span></h2>
                        <p className="text-white-50 mx-auto" style={{ maxWidth: '600px' }}>Everything you need to know about our process, services, and handcrafted art.</p>
                    </header>

                    <div className="accordion accordion-flush glass p-2 rounded-5 border-0 overflow-hidden shadow-2xl mx-auto" id="faqAccordion" style={{ maxWidth: '800px' }}>
                        <div className="accordion-item bg-transparent border-bottom border-secondary border-opacity-10">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed bg-transparent text-white fw-bold py-4 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                                    How do I request a custom commission?
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body text-white-50">
                                    You can start by clicking the "Commission Artwork" button in the hero section or visit our Contact page. Provide details about the subject, size, and your preferred medium, and we'll get back to you with a quote.
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bg-transparent border-bottom border-secondary border-opacity-10">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed bg-transparent text-white fw-bold py-4 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                                    What mediums do you specialize in?
                                </button>
                            </h2>
                            <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body text-white-50">
                                    We specialize in detailed pencil sketches (graphite and charcoal), professional calligraphy, expressive paintings (oil and acrylic), and precise ink art.
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bg-transparent border-0">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed bg-transparent text-white fw-bold py-4 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                                    Do you ship internationally?
                                </button>
                            </h2>
                            <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body text-white-50">
                                    Yes, we ship our artworks worldwide. Each piece is safely packaged in protective tubes or boxes to ensure it reaches you in pristine condition, regardless of the distance.
                                </div>
                            </div>
                        </div>
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
                                <p className="lead text-white-75 mb-5">Whether it is a detailed portrait, a landscape, or a custom painting, we are dedicated to providing art that resonates with your soul.</p>
                                <div className="d-flex flex-wrap gap-4">
                                    <Link to="/contact" className="btn btn-primary rounded-pill px-5 py-3 fw-bold border-0 shadow-glow">
                                        Send an Inquiry
                                    </Link>
                                    <div className="d-flex gap-3 align-items-center">
                                        <a href="https://t.me/aslamtk35" className="text-white opacity-75 hover-opacity-100 transition-all" aria-label="Telegram"><Send size={24} /></a>
                                        <a href="https://www.instagram.com/aslamtk35" className="text-white opacity-75 hover-opacity-100 transition-all" aria-label="Instagram"><Instagram size={24} /></a>
                                        <a href="mailto:aslamtk35@gmail.com" className="text-white opacity-75 hover-opacity-100 transition-all" aria-label="Email"><Mail size={24} /></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 text-center mt-5 mt-lg-0">
                                <div className="display-1 fw-bold text-primary mb-0">50+</div>
                                <div className="h5 fw-bold text-uppercase opacity-75 tracking-widest">Global Clients</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Premium Preview Modal */}
            <ItemPreview
                item={selectedItem}
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                isLiked={selectedItem && likedIds.includes(selectedItem._id || selectedItem.id)}
                toggleLike={() => {
                    const id = selectedItem._id || selectedItem.id;
                    if (selectedItem.price || selectedItem.image) toggleLike(id);
                    else toggleGalleryLike(id);
                }}
                onNext={() => {
                    const items = featuredGallery.length > 0 ? featuredGallery : projects;
                    const currentIndex = items.findIndex(i => (i._id || i.id || i.title) === (selectedItem?._id || selectedItem?.id || selectedItem?.title));
                    const nextIndex = (currentIndex + 1) % items.length;
                    setSelectedItem(items[nextIndex]);
                }}
                onPrev={() => {
                    const items = featuredGallery.length > 0 ? featuredGallery : projects;
                    const currentIndex = items.findIndex(i => (i._id || i.id || i.title) === (selectedItem?._id || selectedItem?.id || selectedItem?.title));
                    const prevIndex = (currentIndex - 1 + items.length) % items.length;
                    setSelectedItem(items[prevIndex]);
                }}
            />
        </div>
    );
};

export default Home;
