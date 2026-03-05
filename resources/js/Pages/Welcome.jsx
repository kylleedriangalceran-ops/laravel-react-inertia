import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import useScrollReveal from '../Hooks/useScrollReveal';

export default function Welcome() {
    const [aboutRef, aboutIsVisible] = useScrollReveal();
    const [skillsRef, skillsIsVisible] = useScrollReveal();
    const [projectsRef, projectsIsVisible] = useScrollReveal();
    const [contactRef, contactIsVisible] = useScrollReveal();

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Drag functionality state
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const projects = [
        {
            title: 'EduGrade: Digital Gradebook',
            desc: 'A comprehensive digital gradebook system for Naawan. The tools that we used are Laravel, Vue and Inertia, then PostgreSQL for the database and Figma for UI/UX designing.',
            tags: [
                { name: 'Laravel', logo: '/images/logos/laravel.png' },
                { name: 'Vue', logo: '/images/logos/vuee.png' },
                { name: 'Inertia.js', logo: '/images/logos/inertia.png' },
                { name: 'PostgreSQL', logo: '/images/logos/postgre.jpg' },
                { name: 'Figma', logo: '/images/logos/figma.png' }
            ],
            status: 'Finished',
            progress: 100
        },
        {
            title: 'Portfolio Website',
            desc: 'A modern, minimalist personal portfolio website showcasing skills, projects, and contact information with dark mode support.',
            tags: [
                { name: 'Laravel', logo: '/images/logos/laravel.png' },
                { name: 'React', logo: '/images/logos/react.png' },
                { name: 'Inertia.js', logo: '/images/logos/inertia.png' },
                { name: 'TailwindCSS', logo: '/images/logos/tailwind.png' }
            ],
            status: 'Finished',
            progress: 100
        },
        {
            title: 'E-Commerce Platform',
            desc: 'A full-featured online store with payment integration, inventory management, and admin dashboard.',
            tags: [
                { name: 'Laravel', logo: '/images/logos/laravel.png' },
                { name: 'React', logo: '/images/logos/react.png' },
                { name: 'TailwindCSS', logo: '/images/logos/tailwind.png' },
                { name: 'PostgreSQL', logo: '/images/logos/postgre.jpg' }
            ],
            status: 'In Progress',
            progress: 65
        },
        {
            title: 'Task Management App',
            desc: 'A collaborative project management tool with real-time updates, kanban boards, and team features.',
            tags: [
                { name: 'Vue', logo: '/images/logos/vuee.png' },
                { name: 'Django', logo: '/images/logos/django.png' },
                { name: 'TailwindCSS', logo: '/images/logos/tailwind.png' },
                { name: 'PostgreSQL', logo: '/images/logos/postgre.jpg' }
            ],
            status: 'Starting',
            progress: 15
        },
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % projects.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
    };

    // Auto-advance carousel
    useEffect(() => {
        let timer;
        if (!isHovered && !isDragging) {
            timer = setInterval(nextSlide, 5000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isHovered, isDragging]);

    // Swipe handlers
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches ? e.targetTouches[0].clientX : e.clientX);
        setIsDragging(true);
    };

    const onTouchMove = (e) => {
        if (!isDragging) return;
        setTouchEnd(e.targetTouches ? e.targetTouches[0].clientX : e.clientX);
    };

    const onTouchEnd = () => {
        setIsDragging(false);
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
    };

    return (
        <Layout>
            <Head title="Portfolio" />

            <style>
                {`
                    @keyframes fade-in-up {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-up {
                        animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }
                    .reveal {
                        opacity: 0;
                        transform: translateY(30px);
                        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
                    }
                    .reveal.visible {
                        opacity: 1;
                        transform: translateY(0);
                    }
                `}
            </style>
            <div className="relative w-full px-0 pt-40 pb-24 flex flex-col justify-center min-h-[90vh] text-left overflow-hidden">
                {/* Removed Hero Background Gradient to allow the global background image to stand out */}

                <div className="animate-fade-in-up flex flex-col items-start w-full max-w-6xl mx-auto px-6 z-10">
                    <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold mb-2 tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                        Hi, I'm Kylle Edrian
                    </h1>

                    <h2 className="text-3xl md:text-5xl lg:text-2xl font-bold text-[var(--color-sky-primary)] mb-6">
                        Aspiring Web Developer
                    </h2>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl leading-relaxed">
                        I am a fresh graduate and an aspiring web developer passionate about building clean, modern web applications. Currently looking for opportunities to grow, contribute to a great team, and deliver beautiful digital experiences.
                    </p>

                    <div className="flex flex-row gap-4 items-center">
                        <Link href="#projects" className="bg-[var(--color-sky-primary)] hover:bg-[var(--color-sky-hover)] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-md flex items-center justify-center">
                            Hire Me
                        </Link>
                        <Link href="#contact" className="bg-white border border-gray-200 hover:border-gray-400 hover:text-gray-500 text-[var(--color-sky-dark)] font-semibold py-3 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-blue-300 dark:bg-transparent dark:border-gray-700 dark:text-[var(--color-sky-light)] dark:hover:border-gray-400 dark:hover:text-gray-400">
                            Let's Talk
                        </Link>
                    </div>

                    <Link href="#about" className="mt-24 text-gray-400 dark:text-gray-600 hover:text-[var(--color-sky-primary)] dark:hover:text-[var(--color-sky-primary)] transition-colors duration-300 animate-bounce">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </Link>
                </div>
            </div>

            {/* About Section */}
            <section id="about" className="py-24 bg-gray-50/50 dark:bg-[#161615]/50 border-y border-gray-100 dark:border-[#3E3E3A]">
                <div ref={aboutRef} className={`max-w-4xl mx-auto px-6 text-center reveal ${aboutIsVisible ? 'visible' : ''}`}>
                    <span className="text-[var(--color-sky-primary)] font-semibold tracking-widest text-xs uppercase mb-4 block">About Me</span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-16 text-gray-900 dark:text-white">A little bit about myself</h2>

                    <div className="flex flex-col md:flex-row items-center gap-12 text-left">
                        <div className="w-1/3 flex justify-center">
                            {/* Profile image */}
                            <div className="w-48 h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden relative shadow-xl shadow-gray-200/50 dark:shadow-none shadow-[var(--color-sky-primary)]/10">
                                <img src="/images/profile/kylle.jpg" alt="Kylle Edrian" className="w-full h-full object-cover transition-all duration-500" />
                            </div>
                        </div>
                        <div className="w-full md:w-2/3 space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                            <p>
                                I'm a fresh graduate and an aspiring full-stack web developer with a strong foundation in Laravel, React, and Inertia.js. I'm passionate about creating clean, user-friendly applications and I'm actively looking for opportunities to join a company where I can learn, grow, and make an impact.
                            </p>
                            <p>
                                I love exploring new technologies, taking on challenges, and continuously sharpening my skills. I'm excited to bring my enthusiasm and dedication to a team that values innovation and collaboration.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="py-24">
                <div ref={skillsRef} className={`max-w-5xl mx-auto px-6 text-center reveal ${skillsIsVisible ? 'visible' : ''}`}>
                    <span className="text-[var(--color-sky-primary)] font-semibold tracking-widest text-xs uppercase mb-4 block">Skills</span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-16 text-gray-900 dark:text-white">Technologies I work with</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        {/* Skill Cards */}
                        {[
                            {
                                name: 'Back-end Development',
                                icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
                                skills: [
                                    { name: 'Laravel', logo: '/images/logos/laravel.png' },
                                    { name: 'Django', logo: '/images/logos/django.png' },
                                    { name: 'JavaScript', logo: '/images/logos/JS.png' },
                                    { name: 'MySQL', logo: '/images/logos/MySQL.png' },
                                    { name: 'PostgreSQL', logo: '/images/logos/postgre.jpg' }
                                ]
                            },
                            {
                                name: 'Front-end Development',
                                icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
                                skills: [
                                    { name: 'Vue', logo: '/images/logos/vuee.png' },
                                    { name: 'React', logo: '/images/logos/react.png' },
                                    { name: 'Next.js', logo: '/images/logos/next.png' },
                                    { name: 'TailwindCSS', logo: '/images/logos/tailwind.png' },
                                    { name: 'Bootstrap', logo: '/images/logos/bootstrap.png' }
                                ]
                            },
                            {
                                name: 'UI/UX Design',
                                icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
                                skills: [
                                    { name: 'Figma', logo: '/images/logos/figma.png' }
                                ]
                            },
                            {
                                name: 'Inertia.js (The Bridge)',
                                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                                description: 'A seamless middleware routing library that perfectly bridges my Laravel backend and React/Vue frontend together. It creates a modern Single Page App (SPA) feel, eliminating the complexity of building separate API endpoints.',
                                skills: [
                                    { name: 'Inertia.js', logo: '/images/logos/inertia.png' }
                                ]
                            }
                        ].map((category, i) => (
                            <div key={i} className="bg-white dark:bg-[#161615] border border-gray-100 dark:border-[#3E3E3A] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-gray-900 dark:text-white group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{category.name}</h3>
                                </div>

                                {category.description && (
                                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm lg:text-base mb-6">
                                        {category.description}
                                    </p>
                                )}

                                <div className="flex flex-wrap gap-3 mt-auto pt-2 border-t border-transparent">
                                    {category.skills.map((skill, index) => (
                                        <div key={index} className="flex items-center gap-2.5 px-4 py-2.5 bg-gray-50 dark:bg-[#20201e] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl border border-gray-200 dark:border-[#393936] hover:border-[var(--color-sky-primary)] dark:hover:border-[var(--color-sky-primary)] transition-colors cursor-default">
                                            <img src={skill.logo} alt={skill.name} className="w-6 h-6 object-contain" />
                                            <span>{skill.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="py-24 bg-gray-50/50 dark:bg-[#161615]/50 border-y border-gray-100 dark:border-[#3E3E3A]">
                <div ref={projectsRef} className={`max-w-6xl mx-auto px-6 text-center reveal ${projectsIsVisible ? 'visible' : ''}`}>
                    <span className="text-[var(--color-sky-primary)] font-semibold tracking-widest text-xs uppercase mb-4 block">Projects</span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-16 text-gray-900 dark:text-white">Featured work</h2>

                    <div
                        className="relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => {
                            setIsHovered(false);
                            setIsDragging(false);
                        }}
                    >
                        {/* Carousel Container */}
                        <div
                            className="overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing"
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                            onMouseDown={onTouchStart}
                            onMouseMove={onTouchMove}
                            onMouseUp={onTouchEnd}
                        >
                            <div
                                className={`flex transition-transform duration-500 ease-out ${isDragging ? 'transition-none' : ''}`}
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {projects.map((project, i) => (
                                    <div key={i} className="w-full flex-shrink-0 px-4">
                                        <div className="bg-white dark:bg-[#202020] border border-gray-100 dark:border-[#3E3E3A] p-8 md:p-12 rounded-2xl shadow-sm text-left flex flex-col h-full mx-auto max-w-4xl">
                                            {/* Status Badge */}
                                            <div className="flex items-center justify-between mb-6">
                                                <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${
                                                    project.status === 'Finished'
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                        : project.status === 'In Progress'
                                                        ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                        : project.status === 'Almost Finished'
                                                        ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                        : 'bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400'
                                                }`}>
                                                    {project.status === 'Finished' && '✓ '}{project.status}
                                                </span>
                                                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{project.progress}%</span>
                                            </div>

                                            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100 transition-colors">{project.title}</h3>
                                            <p className="text-gray-500 dark:text-gray-400 mb-8 text-base md:text-lg leading-relaxed flex-grow">{project.desc}</p>

                                            {/* Progress Bar */}
                                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-8 overflow-hidden">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-1000 ${
                                                        project.progress === 100
                                                            ? 'bg-emerald-500'
                                                            : project.progress >= 75
                                                            ? 'bg-blue-500'
                                                            : project.progress >= 40
                                                            ? 'bg-amber-500'
                                                            : 'bg-gray-400'
                                                    }`}
                                                    style={{ width: `${project.progress}%` }}
                                                ></div>
                                            </div>

                                            <div className="flex flex-wrap gap-3 mb-8">
                                                {project.tags.map((tag, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-[#303030] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full border border-gray-200 dark:border-[#404040]">
                                                        <img src={tag.logo} alt={tag.name} className="w-5 h-5 object-contain" />
                                                        <span>{tag.name}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <a href="#" className="inline-flex items-center text-base font-semibold text-[var(--color-sky-primary)] hover:text-[var(--color-sky-hover)] group/link mt-auto w-max">
                                                View Project Details
                                                <svg className="w-5 h-5 ml-1 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Carousel Controls */}
                        <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 w-12 h-12 flex items-center justify-center bg-white dark:bg-[#202020] border border-gray-200 dark:border-[#3E3E3A] rounded-full shadow-md text-gray-600 dark:text-gray-300 hover:text-[var(--color-sky-primary)] hover:border-[var(--color-sky-primary)] transition-all z-10">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 w-12 h-12 flex items-center justify-center bg-white dark:bg-[#202020] border border-gray-200 dark:border-[#3E3E3A] rounded-full shadow-md text-gray-600 dark:text-gray-300 hover:text-[var(--color-sky-primary)] hover:border-[var(--color-sky-primary)] transition-all z-10">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>

                        {/* Carousel Indicators */}
                        <div className="flex justify-center gap-2 mt-8">
                            {projects.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className={`w-3 h-3 rounded-full transition-all ${currentSlide === i ? 'bg-[var(--color-sky-primary)] w-8' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'}`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24">
                <div ref={contactRef} className={`max-w-2xl mx-auto px-6 text-center reveal ${contactIsVisible ? 'visible' : ''}`}>
                    <span className="text-[var(--color-sky-primary)] font-semibold tracking-widest text-xs uppercase mb-4 block">Contact</span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Get in touch</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-12">Have a project in mind or looking to hire? Let's connect.</p>

                    <div className="bg-white dark:bg-[#161615] border border-gray-100 dark:border-[#3E3E3A] p-8 rounded-2xl shadow-sm">
                        <form className="space-y-4" onSubmit={async (e) => {
                            e.preventDefault();

                            // Import gooeyToast dynamically
                            const { gooeyToast } = await import('goey-toast');

                            try {
                                // TODO: Replace this with your actual Axios/Inertia form submission
                                // await axios.post('/contact', formData);

                                gooeyToast.success('Message Sent', {
                                    description: 'Thanks for reaching out! I will get back to you soon.',
                                    action: {
                                        label: 'Undo',
                                        onClick: () => {},
                                    },
                                    borderColor: '#E0E0E0',
                                    borderWidth: 2,
                                });
                                e.target.reset();
                            } catch (error) {
                                // Example Error Toast
                                gooeyToast.error('Failed to send', {
                                    description: 'Something went wrong while sending your message. Please try again.',
                                    borderColor: '#ff4d4f',
                                    borderWidth: 2,
                                });
                            }
                        }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    required
                                    className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#3E3E3A] rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-sky-primary)] focus:border-transparent transition-shadow"
                                />
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    required
                                    className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#3E3E3A] rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-sky-primary)] focus:border-transparent transition-shadow"
                                />
                            </div>
                            <textarea
                                rows="5"
                                placeholder="Your message"
                                required
                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#3E3E3A] rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-sky-primary)] focus:border-transparent transition-shadow resize-none"
                            ></textarea>

                            <div className="text-left">
                                <button type="submit" className="bg-[var(--color-sky-primary)] hover:bg-[var(--color-sky-hover)] text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 group cursor-pointer">
                                    Send Message
                                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="pt-16 pb-8 flex justify-center gap-8">
                        <a href="https://mail.google.com/mail/u/0/#inbox" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all transform hover:scale-110">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </a>
                        <a href="https://github.com/kylleedriangalceran-ops" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all transform hover:scale-110">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 100.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                        </a>
                    </div>

                    <div className="text-sm text-gray-400 mt-4">
                        &copy; 2026 Kylle Edrian. Built with passion.
                    </div>
                </div>
            </section>
        </Layout>
    );
}
