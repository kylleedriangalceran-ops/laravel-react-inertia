import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import useScrollReveal from '../Hooks/useScrollReveal';

export default function Welcome() {
    const [aboutRef, aboutIsVisible] = useScrollReveal();
    const [skillsRef, skillsIsVisible] = useScrollReveal();
    const [projectsRef, projectsIsVisible] = useScrollReveal();
    const [contactRef, contactIsVisible] = useScrollReveal();

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
            <div className="relative w-full max-w-5xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center justify-center min-h-[90vh] text-center overflow-hidden">
                {/* Subtle Background Image */}
                <div className="absolute inset-0 -z-10 bg-[url('/images/backgrounds/download.png')] bg-cover bg-center opacity-10 dark:opacity-20"></div>

                {/* Subtle Gradient Glow */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-40 dark:opacity-20 pointer-events-none">
                    <div className="w-[600px] h-[600px] bg-gradient-to-tr from-[var(--color-sky-light)] to-transparent rounded-full blur-3xl opacity-50 dark:opacity-10 translate-x-1/4 -translate-y-1/4"></div>
                    <div className="w-[400px] h-[400px] bg-gradient-to-bl from-[var(--color-sky-light)] to-transparent rounded-full blur-3xl opacity-40 dark:opacity-10 -translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="animate-fade-in-up flex flex-col items-center w-full">
                    <span className="text-[var(--color-sky-primary)] font-semibold tracking-widest text-xs uppercase mb-6 px-4 py-1.5 rounded-full bg-[var(--color-sky-light)]/50 dark:bg-[var(--color-sky-primary)]/10">Aspiring Web Developer</span>

                    <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold mb-6 tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                        Hi, I'm <span className="text-[var(--color-sky-primary)]">Kylle Edrian</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        A fresh graduate passionate about building clean, modern web applications with Laravel, React, and cutting-edge tools. Eager to grow and contribute to a great team.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md">
                        <a href="#projects" className="w-full sm:w-auto bg-[var(--color-sky-primary)] hover:bg-[var(--color-sky-hover)] text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2">
                            View Projects
                        </a>
                        <a href="#contact" className="w-full sm:w-auto bg-white dark:bg-[#161615] border-2 border-gray-100 dark:border-[#3E3E3A] hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-white font-medium py-3 px-8 rounded-full transition-all duration-300 hover:bg-gray-50 dark:hover:bg-[#1f1f1f] flex items-center justify-center">
                            Contact Me
                        </a>
                    </div>

                    <a href="#about" className="mt-24 text-gray-400 dark:text-gray-600 hover:text-[var(--color-sky-primary)] dark:hover:text-[var(--color-sky-primary)] transition-colors duration-300 animate-bounce">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </a>
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
                                    <div className="text-[var(--color-sky-primary)] bg-[var(--color-sky-light)] dark:bg-[var(--color-sky-primary)]/10 p-3 rounded-lg group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div ref={projectsRef} className={`max-w-5xl mx-auto px-6 text-center reveal ${projectsIsVisible ? 'visible' : ''}`}>
                    <span className="text-[var(--color-sky-primary)] font-semibold tracking-widest text-xs uppercase mb-4 block">Projects</span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-16 text-gray-900 dark:text-white">Featured work</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        {[
                            { title: 'E-Commerce Platform', desc: 'A full-featured online store with payment integration, inventory management, and admin dashboard.', tags: ['Laravel', 'React', 'Inertia.js', 'MySQL'] },
                            { title: 'Task Management App', desc: 'A collaborative project management tool with real-time updates, kanban boards, and team features.', tags: ['Laravel', 'React', 'TailwindCSS', 'PostgreSQL'] },
                            { title: 'Portfolio CMS', desc: 'A headless CMS built for creatives to manage and showcase their work with a beautiful frontend.', tags: ['Laravel', 'Inertia.js', 'TailwindCSS'] },
                            { title: 'Analytics Dashboard', desc: 'Real-time data visualization dashboard with interactive charts and customizable widgets.', tags: ['React', 'TailwindCSS', 'REST API'] },
                        ].map((project, i) => (
                            <div key={i} className="bg-white dark:bg-[#202020] border border-gray-100 dark:border-[#3E3E3A] p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-[var(--color-sky-primary)] transition-colors">{project.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 h-12 leading-relaxed text-sm">{project.desc}</p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#303030] px-3 py-1 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <a href="#" className="inline-flex items-center text-sm font-semibold text-[var(--color-sky-primary)] hover:text-[var(--color-sky-hover)] group/link">
                                    View Project
                                    <svg className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24">
                <div ref={contactRef} className={`max-w-2xl mx-auto px-6 text-center reveal ${contactIsVisible ? 'visible' : ''}`}>
                    <span className="text-[var(--color-sky-primary)] font-semibold tracking-widest text-xs uppercase mb-4 block">Contact</span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Get in touch</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-12">Have a project in mind? Let's work together.</p>

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
                                borderColor: '#ff4d4f', // A subtle red border for error
                                borderWidth: 2,
                            });
                        }
                    }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Your name"
                                required
                                className="w-full bg-gray-50 dark:bg-[#161615] border border-gray-200 dark:border-[#3E3E3A] rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-sky-primary)] focus:border-transparent transition-shadow"
                            />
                            <input
                                type="email"
                                placeholder="Your email"
                                required
                                className="w-full bg-gray-50 dark:bg-[#161615] border border-gray-200 dark:border-[#3E3E3A] rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-sky-primary)] focus:border-transparent transition-shadow"
                            />
                        </div>
                        <textarea
                            rows="5"
                            placeholder="Your message"
                            required
                            className="w-full bg-gray-50 dark:bg-[#161615] border border-gray-200 dark:border-[#3E3E3A] rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-sky-primary)] focus:border-transparent transition-shadow resize-none"
                        ></textarea>

                        <div className="text-left">
                            <button type="submit" className="bg-[var(--color-sky-primary)] hover:bg-[var(--color-sky-hover)] text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 group">
                                Send Message
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    <div className="pt-16 pb-8 flex justify-center gap-6">
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#161615] border border-gray-200 dark:border-[#3E3E3A] flex items-center justify-center text-gray-500 hover:text-[var(--color-sky-primary)] hover:border-[var(--color-sky-primary)] transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#161615] border border-gray-200 dark:border-[#3E3E3A] flex items-center justify-center text-gray-500 hover:text-[var(--color-sky-primary)] hover:border-[var(--color-sky-primary)] transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 100.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#161615] border border-gray-200 dark:border-[#3E3E3A] flex items-center justify-center text-gray-500 hover:text-[var(--color-sky-primary)] hover:border-[var(--color-sky-primary)] transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" /></svg>
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
