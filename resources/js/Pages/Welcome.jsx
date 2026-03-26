import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Github,
    Linkedin,
    Facebook,
    Instagram,
    ChevronDown,
    Lightbulb,
    Rocket,
    Heart,
    BookOpen,
    User,
    Download,
    MapPin,
    ArrowRight,
    Mail,
    Phone,
    Send,
    Briefcase,
    Award,
    Trophy,
    Calendar,
    ExternalLink,
    Clock,
    Tag,
    Star,
    Eye,
} from "lucide-react";
import axios from "axios";
import Layout from "../Layouts/Layout";
import SectionHeader from "../Components/SectionHeader";

const Typewriter = ({
    text,
    typingSpeed = 100,
    erasingSpeed = 50,
    pauseTime = 2000,
}) => {
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout;

        if (!isDeleting && currentText.length < text.length) {
            // Typing
            timeout = setTimeout(() => {
                setCurrentText(text.substring(0, currentText.length + 1));
            }, typingSpeed);
        } else if (isDeleting && currentText.length > 0) {
            // Erasing
            timeout = setTimeout(() => {
                setCurrentText(text.substring(0, currentText.length - 1));
            }, erasingSpeed);
        } else if (!isDeleting && currentText.length === text.length) {
            // Pause before erasing
            timeout = setTimeout(() => setIsDeleting(true), pauseTime);
        } else if (isDeleting && currentText.length === 0) {
            // Pause before typing again
            timeout = setTimeout(() => setIsDeleting(false), 500);
        }

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, text, typingSpeed, erasingSpeed, pauseTime]);

    return (
        <span className="border-r-[3px] border-sky-400 pr-1 animate-pulse">
            {currentText}
        </span>
    );
};

import useScrollReveal from "../Hooks/useScrollReveal";
import useSkills from "../Hooks/useSkills";
import ContactForm from "../Components/ContactForm";
import SkillCard from "../Components/SkillCard";
import CategoryToggle from "../Components/CategoryToggle";
import TestimonialCarousel from "../Components/TestimonialCarousel";

export default function Welcome({ totalVisits = 0, avgRating = 0, totalRatings = 0, testimonials = [] }) {
    const [aboutRef, aboutIsVisible] = useScrollReveal();
    const [experienceRef, experienceIsVisible] = useScrollReveal();
    const [educationRef, educationIsVisible] = useScrollReveal();
    const [skillsRef, skillsIsVisible] = useScrollReveal();
    const [projectsRef, projectsIsVisible] = useScrollReveal();
    const [certsRef, certsIsVisible] = useScrollReveal();
    const [testimonialsRef, testimonialsIsVisible] = useScrollReveal();
    const [blogRef, blogIsVisible] = useScrollReveal();
    const [contactRef, contactIsVisible] = useScrollReveal();

    const [activeProject, setActiveProject] = useState(0);
    const { activeCategory, setActiveCategory, categories, getCurrentSkills } =
        useSkills();

    const [hasRated, setHasRated] = useState(() => {
        try { return !!localStorage.getItem("portfolio_rated"); } catch { return false; }
    });
    const [submittedRating, setSubmittedRating] = useState(() => {
        try { return parseInt(localStorage.getItem("portfolio_rated")) || 0; } catch { return 0; }
    });
    const [hoverStar, setHoverStar] = useState(0);
    const [liveAvg, setLiveAvg] = useState(avgRating);
    const [liveTotal, setLiveTotal] = useState(totalRatings);

    const handleRate = (star) => {
        if (hasRated) return;
        axios.post("/analytics/rate", { rating: star })
            .then((res) => {
                setHasRated(true);
                setSubmittedRating(star);
                setHoverStar(0);
                localStorage.setItem("portfolio_rated", String(star));
                if (res.data.avgRating) setLiveAvg(res.data.avgRating);
                if (res.data.totalRatings) setLiveTotal(res.data.totalRatings);
            })
            .catch(() => { });
    };

    const scrollToSection = (e, id) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    const experiences = [
        {
            role: "Freelance Web Developer",
            company: "Self-Employed",
            period: "2024 — Present",
            desc: "Designing and building full-stack web applications for clients using Laravel, React, and Inertia.js. Focused on clean UI, performant back-ends, and great user experiences.",
            tags: ["Laravel", "React", "Inertia.js", "TailwindCSS", "MySQL"],
            type: "Freelance",
            isActive: true,
        },
        {
            role: "System Analyst",
            company: "MSU Naawan — EduGrade Project",
            period: "2023 — 2024",
            desc: "As a System Analyst of the development of EduGrade project, a digital gradebook system for Naawan Central School. Handled architecture, database design, UI/UX in Figma, and deployment.",
            tags: ["Laravel", "Vue.js", "PostgreSQL", "Figma", "Inertia.js"],
            type: "Capstone",
            isActive: false,
        },
    ];

    const certs = [
        {
            title: "Responsive Web Design",
            issuer: "freeCodeCamp",
            date: "2023",
            desc: "300 hours of training in HTML, CSS, and building accessible, responsive web layouts.",
            type: "Certificate",
            color: "sky",
        },
        {
            title: "JavaScript Algorithms & Data Structures",
            issuer: "freeCodeCamp",
            date: "2023",
            desc: "300 hours of JavaScript covering ES6, functional programming, OOP, and algorithm challenges.",
            type: "Certificate",
            color: "sky",
        },
        {
            title: "Best Capstone Project",
            issuer: "MSU Naawan — BSIT Dept.",
            date: "2025",
            desc: "Recognized for outstanding final-year project: EduGrade Digital Gradebook System.",
            type: "Achievement",
            color: "amber",
        },
        {
            title: "React — The Complete Guide",
            issuer: "Udemy",
            date: "2024",
            desc: "Comprehensive React course covering hooks, context API, Redux, and real-world project builds.",
            type: "Certificate",
            color: "sky",
        },
        {
            title: "The Web Developer Bootcamp",
            issuer: "Udemy",
            date: "2023",
            desc: "Full-stack web development bootcamp covering HTML, CSS, JS, Node.js, MongoDB, and REST APIs.",
            type: "Certificate",
            color: "sky",
        },
        {
            title: "Dean's List Awardee",
            issuer: "MSU Naawan",
            date: "2022–2024",
            desc: "Consistently recognized on the Dean's List for academic excellence across multiple semesters.",
            type: "Achievement",
            color: "amber",
        },
    ];

    const blogs = [
        {
            title: "Why I Chose Laravel + React (Inertia) for My Stack",
            category: "Stack Thoughts",
            excerpt:
                "A full-stack PHP framework paired with a modern JS library — here's why this combo clicked for me and how it changed how I build apps.",
            readTime: "5 min read",
            date: "Mar 2025",
            tags: ["Laravel", "React", "Inertia"],
        },
        {
            title: "Clean Code Habits I Picked Up as a Junior Dev",
            category: "Dev Tips",
            excerpt:
                "From meaningful variable names to avoiding premature abstraction — small daily habits that made a huge difference in code quality.",
            readTime: "4 min read",
            date: "Feb 2025",
            tags: ["Clean Code", "Best Practices"],
        },
        {
            title: "Building Real-Time Chat with HTTP Polling",
            category: "Tutorial",
            excerpt:
                "No WebSockets needed. Here's how I built a functional live chat feature using simple interval polling in Laravel + React.",
            readTime: "7 min read",
            date: "Jan 2025",
            tags: ["Laravel", "React", "Real-time"],
        },
    ];

    const projects = [
        {
            title: "EduGrade: Digital Gradebook",
            desc: "A comprehensive digital gradebook system for Naawan Central School. The tools that we used are Laravel, Vue and Inertia, then PostgreSQL for the database and Figma for UI/UX designing.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2000",
            tags: [
                { name: "Laravel", logo: "/images/logos/laravel.png" },
                { name: "Vue", logo: "/images/logos/vuee.png" },
                { name: "Inertia", logo: "/images/logos/inertia.png" },
                { name: "PostgreSQL", logo: "/images/logos/postgre.png" },
                { name: "Figma", logo: "/images/logos/figma.png" },
            ],
            status: "Finished",
            progress: 100,
        },
        {
            title: "Portfolio Website",
            desc: "A modern, minimalist personal portfolio website showcasing skills, projects, and contact information with dark mode support.",
            image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=2000",
            tags: [
                { name: "Laravel", logo: "/images/logos/laravel.png" },
                { name: "React", logo: "/images/logos/react.png" },
                { name: "Inertia", logo: "/images/logos/inertia.png" },
                { name: "TailwindCSS", logo: "/images/logos/tailwind.png" },
            ],
            status: "Finished",
            progress: 100,
        },
        {
            title: "E-Commerce Platform",
            desc: "A full-featured online store with payment integration, inventory management, and admin dashboard.",
            image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2000",
            tags: [
                { name: "Laravel", logo: "/images/logos/laravel.png" },
                { name: "React", logo: "/images/logos/react.png" },
                { name: "TailwindCSS", logo: "/images/logos/tailwind.png" },
                { name: "PostgreSQL", logo: "/images/logos/postgre.png" },
            ],
            status: "In Progress",
            progress: 65,
        },
    ];

    return (
        <Layout>
            <Head title="Portfolio" />

            <style>
                {`
                    @keyframes fade-in-up {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes slideInLeft {
                        from { opacity: 0; transform: translateX(-80px) rotate(-1deg); }
                        to { opacity: 1; transform: translateX(0) rotate(0deg); }
                    }
                    @keyframes slideInRight {
                        from { opacity: 0; transform: translateX(80px) rotate(1deg); }
                        to { opacity: 1; transform: translateX(0) rotate(0deg); }
                    }
                    .animate-fade-in-up {
                        animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }
                    .animate-slide-in-left {
                        animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }
                    .animate-slide-in-right {
                        animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
            {/* Hero Section */}
            <div className="relative w-full px-0 pt-40 pb-24 flex flex-col justify-center min-h-[90vh] text-left overflow-hidden">
                <div className="animate-fade-in-up flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-6 z-10 gap-12">
                    <div className="flex flex-col items-start w-full md:w-1/2 lg:w-3/5">
                        <h1 className="text-6xl md:text-5xl lg:text-[90px] font-extrabold tracking-tight text-gray-900 dark:text-white leading-none mb-6 mt-8 md:mt-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            Hi, I'm Kylle
                        </h1>

                        <div className="inline-block relative mb-8">
                            <h2 className="text-3xl md:text-4xl lg:text-3xl font-bold text-sky-primary tracking-tight min-h-[40px] md:min-h-[48px]">
                                <Typewriter
                                    text="Aspiring Web Developer"
                                    delay={100}
                                />
                            </h2>
                        </div>

                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl leading-relaxed">
                            I am 22 years old and i am a fresh graduate and an
                            aspiring web developer passionate about building
                            clean, modern web applications. Currently looking
                            for opportunities to grow, contribute to a great
                            team, and deliver beautiful digital experiences.
                        </p>

                        <div className="flex flex-col gap-8">
                            <div className="flex flex-wrap gap-4 items-center">
                                <Link
                                    href="#projects"
                                    onClick={(e) =>
                                        scrollToSection(e, "projects")
                                    }
                                    className="bg-sky-primary hover:bg-sky-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Hire Me
                                </Link>
                                <Link
                                    href="#contact"
                                    onClick={(e) =>
                                        scrollToSection(e, "contact")
                                    }
                                    className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 hover:border-sky-300 dark:hover:border-sky-500/50 text-sky-primary dark:text-sky-400 font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Let's Talk
                                </Link>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-8">
                                <div className="flex items-center gap-5">
                                    {[
                                        {
                                            name: "GitHub",
                                            icon: Github,
                                            url: "https://github.com/kylleedriangalceran-ops?tab=repositories",
                                        },
                                        {
                                            name: "LinkedIn",
                                            icon: Linkedin,
                                            url: "https://www.linkedin.com/in/kylle-edrian-galceran-b03a1b328/",
                                        },
                                        {
                                            name: "Facebook",
                                            icon: Facebook,
                                            url: "https://www.facebook.com/khael.galceran",
                                        },
                                        {
                                            name: "Instagram",
                                            icon: Instagram,
                                            url: "https://www.instagram.com/kyyyllee_/",
                                        },
                                    ].map((social, i) => {
                                        const Icon = social.icon;
                                        return (
                                            <a
                                                key={i}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-sky-primary transition-colors transform hover:scale-110"
                                                aria-label={social.name}
                                            >
                                                <Icon
                                                    className="w-6 h-6"
                                                    strokeWidth={1.5}
                                                />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 lg:w-2/5 flex justify-center md:justify-end mt-12 md:-mt-24 lg:-mt-40 xl:-mt-64 pointer-events-none">
                        <div className="relative group w-[350px] h-[350px] md:w-[500px] md:h-[500px] lg:w-[700px] lg:h-[700px]">
                            <div
                                className="relative w-full h-full overflow-hidden"
                                style={{
                                    WebkitMaskImage:
                                        "radial-gradient(circle at 45% 45%, black 40%, transparent 75%)",
                                    maskImage:
                                        "radial-gradient(circle at 45% 45%, black 40%, transparent 75%)",
                                }}
                            >
                                <img
                                    src="/images/profile/kylle.png"
                                    alt="Kylle"
                                    className="w-full h-full object-cover object-top opacity-90 transition-all duration-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center mt-24 text-center">
                    <Link
                        href="#about"
                        onClick={(e) => scrollToSection(e, "about")}
                        className="text-gray-400 dark:text-gray-600 hover:text-sky-primary dark:hover:text-sky-primary transition-colors duration-300 animate-bounce"
                    >
                        <ChevronDown className="w-8 h-8" strokeWidth={2.5} />
                    </Link>
                </div>
            </div>

            {/* Section Divider */}
            <div className="w-full h-px bg-linear-to-r from-transparent via-sky-primary/20 to-transparent"></div>

            {/* About Section */}
            <section
                id="about"
                ref={aboutRef}
                className={`relative py-40 bg-transparent transition-colors duration-300 reveal overflow-hidden ${aboutIsVisible ? "visible" : ""
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 relative">
                    {/* Section Header - Centered as per screenshot */}
                    {/* Section Header */}
                    <div className="text-center mb-16 flex flex-col items-center">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="text-xl md:text-xl font-bold text-sky-primary tracking-[0.2em] uppercase">
                                About Me
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
                            A little bit about myself
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            Who am I
                        </p>
                    </div>

                    {/* Main Content: Two Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                        {/* Profile Image Column (5/12 width) */}
                        <div className="lg:col-span-5 flex flex-col items-center">
                            <div className="relative group">
                                <div
                                    className="relative w-80 h-80 md:w-96 md:h-96 overflow-hidden"
                                    style={{
                                        WebkitMaskImage:
                                            "radial-gradient(circle at 50% 50%, black 45%, transparent 80%)",
                                        maskImage:
                                            "radial-gradient(circle at 50% 50%, black 45%, transparent 80%)",
                                    }}
                                >
                                    <img
                                        src="/images/profile/kylle.png"
                                        alt="Kylle Edrian"
                                        className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                                    />
                                </div>

                                <div className="mt-8 text-center">
                                    <a
                                        href="/images/profile/galceran.pdf"
                                        download="Kylle_Edrian_Galceran_CV.pdf"
                                        className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-sky-primary dark:hover:text-sky-primary transition-all duration-300 font-medium tracking-wide group"
                                    >
                                        <Download className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
                                        <span>Download CV</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Content Column (7/12 width) */}
                        <div className="lg:col-span-7 space-y-10">
                            <div className="space-y-6">
                                <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white flex flex-wrap items-center gap-x-3">
                                    Hello! I'm{" "}
                                    <span className="text-sky-500 dark:text-sky-300">
                                        Kylle Edrian
                                    </span>
                                </h3>

                                <div className="space-y-6 text-base md:text-[1.05rem] text-gray-500/90 dark:text-gray-400 leading-[1.8] font-normal">
                                    <p>
                                        I'm a fresh graduate with a Bachelor of
                                        Science in Information Technology from
                                        Mindanao State University at Naawan. I
                                        discovered my passion for web
                                        development during college, the thrill
                                        of turning ideas into real, interactive
                                        applications hooked me instantly.
                                    </p>
                                    <p>
                                        I believe in writing clean, readable
                                        code and building applications that
                                        don't just work, but feel great to use.
                                        I'm a detail-oriented person who
                                        genuinely enjoys the process of refining
                                        an interface until it's just right. I'm
                                        actively looking for opportunities to
                                        join a team where i can learn from
                                        experienced developers, grow my skills,
                                        and contribute to something meaningful.
                                    </p>
                                </div>
                            </div>

                            {/* Tags / Skills Badges */}
                        </div>
                    </div>

                    {/* Interest Cards */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Tech Interests */}
                        <div className="bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md rounded-[2.5rem] p-10 shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/40 border border-gray-100 dark:border-white/5 transition-all duration-300 flex flex-col h-full group hover:border-sky-500/30">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-sky-50 dark:bg-sky-900/10 flex items-center justify-center">
                                    <Lightbulb
                                        className="w-6 h-6 text-sky-500"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Tech Interests
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 grow">
                                I'm passionate about full-stack web development
                                — building everything from pixel-perfect
                                front-ends to robust server-side architectures.
                                I love exploring modern frameworks and crafting
                                seamless user experiences.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {[
                                    "Laravel",
                                    "React",
                                    "Inertia.js",
                                    "UI/UX Design",
                                    "REST APIs",
                                ].map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 rounded-lg text-xs font-semibold border border-sky-100 dark:border-sky-800/30"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Currently Learning */}
                        <div className="bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md rounded-[2.5rem] p-10 shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/40 border border-gray-100 dark:border-white/5 transition-all duration-300 flex flex-col h-full group hover:border-sky-500/30">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-sky-50 dark:bg-sky-900/10 flex items-center justify-center">
                                    <Rocket
                                        className="w-6 h-6 text-sky-500"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Currently Learning
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 grow">
                                I never stop learning. Right now I'm deepening
                                my knowledge in advanced React patterns,
                                exploring Next.js for SSR/SSG, and improving my
                                understanding of database optimization and
                                deployment workflows.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {[
                                    "Advanced React",
                                    "Next.js",
                                    "TypeScript",
                                    "Nuxt.js",
                                    "Docker",
                                ].map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 rounded-lg text-xs font-semibold border border-sky-100 dark:border-sky-800/30"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Hobbies & Interests */}
                        <div className="bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md rounded-[2.5rem] p-10 shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/40 border border-gray-100 dark:border-white/5 transition-all duration-300 flex flex-col h-full group hover:border-sky-500/30">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-sky-50 dark:bg-sky-900/10 flex items-center justify-center">
                                    <Heart
                                        className="w-6 h-6 text-sky-500"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Hobbies & Interests
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 grow">
                                When I'm not coding, you'll find me playing
                                mobile games, enjoying music, watching anime and
                                movies, or playing basketball. I believe a
                                balanced life fuels better creativity and focus.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {[
                                    "Basketball",
                                    "Mobile Games",
                                    "Music",
                                    "Anime",
                                    "Movies",
                                ].map((hobby, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 rounded-lg text-xs font-semibold border border-sky-100 dark:border-sky-800/30"
                                    >
                                        {hobby}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Divider */}
            <div className="w-full h-px bg-linear-to-r from-transparent via-sky-primary/20 to-transparent"></div>

            {/* Experience Section */}
            <section
                id="experience"
                ref={experienceRef}
                className={`relative py-32 bg-transparent transition-colors duration-300 reveal ${experienceIsVisible ? "visible" : ""}`}
            >
                <div className="max-w-6xl mx-auto px-6">
                    <SectionHeader
                        label="Experiences"
                        title="My Journey So Far"
                        subtitle="Professional work and key projects that shaped my skills."
                        className="mb-20"
                    />

                    <div className="relative max-w-3xl mx-auto">
                        {/* Vertical line */}
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-sky-200 dark:bg-white/10"></div>

                        <div className="space-y-10">
                            {experiences.map((exp, index) => (
                                <div key={index} className="relative pl-16">
                                    {/* Timeline dot */}
                                    <div className="absolute left-[24px] top-8 flex items-center justify-center -translate-x-1/2">
                                        {exp.isActive ? (
                                            <div className="w-[18px] h-[18px] rounded-full border-[4px] border-white dark:border-[#111111] bg-sky-300 ring-[6px] ring-sky-50 dark:ring-sky-900/40"></div>
                                        ) : (
                                            <div className="w-3.5 h-3.5 rounded-full bg-gray-300 dark:bg-gray-600 ring-[5px] ring-white dark:ring-[#111111]"></div>
                                        )}
                                    </div>

                                    {/* Card */}
                                    <div className="bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-black/40 border border-gray-100 dark:border-white/5 hover:border-sky-500/30 transition-all duration-300">
                                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                            <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${exp.type === "Freelance" || exp.isActive ? "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400" : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"}`}>
                                                {exp.type}
                                            </span>
                                            <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest ${exp.isActive ? "bg-sky-50 dark:bg-sky-500/10 text-sky-500" : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500"}`}>
                                                {exp.period}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            {exp.role}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mb-4">
                                            <Briefcase className="w-4 h-4 shrink-0" />
                                            <span>{exp.company}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
                                            {exp.desc}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {exp.tags.map((tag, i) => (
                                                <span key={i} className="px-3 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 rounded-lg text-xs font-semibold border border-sky-100 dark:border-sky-800/30">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Divider */}
            <div className="w-full h-px bg-linear-to-r from-transparent via-sky-primary/20 to-transparent"></div>

            {/* Education Section */}
            <section
                id="education"
                ref={educationRef}
                className={`relative py-32 bg-transparent transition-colors duration-300 reveal ${educationIsVisible ? "visible" : ""
                    }`}
            >
                <div className="max-w-6xl mx-auto px-6">
                    {/* Education Section Header */}
                    <div className="text-center mb-20 flex flex-col items-center">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="text-xl md:text-xl font-bold text-sky-primary tracking-[0.2em] uppercase">
                                Education
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B1528] dark:text-white tracking-tight mb-4">
                            My Academic Journey
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            The milestones that shaped my path into technology.
                        </p>
                    </div>

                    {/* Timeline Container */}
                    <div className="relative max-w-5xl mx-auto mt-12 pb-10">
                        {/* Center Line Desktop + Mobile Line */}
                        <div
                            className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-sky-200 dark:bg-white/10"
                            style={{ transform: "translateX(-50%)" }}
                        ></div>

                        <div className="space-y-16">
                            {/* Item 1: College */}
                            <div className="relative flex flex-col md:flex-row items-center justify-between group">
                                {/* Desktop Center Dot */}
                                <div
                                    className="absolute left-[27px] md:left-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10"
                                    style={{ transform: "translateX(-50%)" }}
                                >
                                    <div className="w-[18px] h-[18px] rounded-full border-[4px] border-white dark:border-[#111111] bg-sky-300 ring-[6px] ring-sky-50 dark:ring-sky-900/40"></div>
                                </div>

                                {/* Content: Left for Desktop */}
                                <div className="w-full md:w-1/2 md:pr-12 md:text-right pl-16 md:pl-0 z-10 flex flex-col items-start md:items-end">
                                    <h3 className="text-[1.35rem] md:text-[1.7rem] font-bold text-[#0B1528] dark:text-white leading-tight mb-1">
                                        Bachelor of Science in Information
                                        Technology
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm md:text-[15px]">
                                        <MapPin className="w-4 h-4 shrink-0" />
                                        <span>
                                            Mindanao State University at Naawan
                                        </span>
                                    </div>
                                </div>

                                {/* Meta: Right for Desktop */}
                                <div className="w-full md:w-1/2 md:pl-12 pl-16 md:pl-0 mt-4 md:mt-0 z-10 flex flex-col items-start md:items-start md:pt-1">
                                    <div className="inline-flex items-center">
                                        <span className="px-3 md:px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-500 text-[11px] md:text-xs font-bold tracking-widest uppercase">
                                            2022 - PRESENT
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-2 md:ml-2">
                                        COLLEGE
                                    </span>
                                </div>
                            </div>

                            {/* Item 2: Senior High School */}
                            <div className="relative flex flex-col md:flex-row items-center justify-between group">
                                {/* Desktop Center Dot */}
                                <div
                                    className="absolute left-[27px] md:left-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10"
                                    style={{ transform: "translateX(-50%)" }}
                                >
                                    <div className="w-3.5 h-3.5 rounded-full bg-gray-300 dark:bg-gray-600 ring-[5px] ring-white dark:ring-[#111111]"></div>
                                </div>

                                {/* Content: Right for Desktop */}
                                <div className="order-1 md:order-2 w-full md:w-1/2 md:pl-12 pl-16 md:pl-0 z-10 flex flex-col items-start md:items-start">
                                    <h3 className="text-[1.35rem] md:text-[1.7rem] font-bold text-[#0B1528] dark:text-white leading-tight mb-1">
                                        Electrical Installation Maintenance
                                    </h3>
                                    <div className="flex items-center justify-start gap-1.5 text-gray-500 dark:text-gray-400 text-[15px]">
                                        <MapPin className="w-4 h-4 shrink-0" />
                                        <span>
                                            Iligan City East National High
                                            School
                                        </span>
                                    </div>
                                </div>

                                {/* Meta: Left for Desktop */}
                                <div className="order-2 md:order-1 w-full md:w-1/2 md:pr-12 md:text-right pl-16 md:pl-0 mt-4 md:mt-0 z-10 flex flex-col items-start md:items-end md:pt-1">
                                    <div className="inline-flex items-center">
                                        <span className="px-3 md:px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-[11px] md:text-xs font-bold tracking-widest uppercase">
                                            2020 - 2022
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-2 md:mr-2">
                                        SENIOR HIGH SCHOOL
                                    </span>
                                </div>
                            </div>

                            {/* Item 3: Junior High School */}
                            <div className="relative flex flex-col md:flex-row items-center justify-between group">
                                {/* Desktop Center Dot */}
                                <div
                                    className="absolute left-[27px] md:left-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10"
                                    style={{ transform: "translateX(-50%)" }}
                                >
                                    <div className="w-3.5 h-3.5 rounded-full bg-gray-300 dark:bg-gray-600 ring-[5px] ring-white dark:ring-[#111111]"></div>
                                </div>

                                {/* Content: Left for Desktop */}
                                <div className="w-full md:w-1/2 md:pr-12 md:text-right pl-16 md:pl-0 z-10 flex flex-col items-start md:items-end">
                                    <h3 className="text-[1.35rem] md:text-[1.7rem] font-bold text-[#0B1528] dark:text-white leading-tight mb-1">
                                        Basic Education Curriculum
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-[15px]">
                                        <MapPin className="w-4 h-4 shrink-0" />
                                        <span>
                                            Iligan City East National High
                                            School
                                        </span>
                                    </div>
                                </div>

                                {/* Meta: Right for Desktop */}
                                <div className="w-full md:w-1/2 md:pl-12 pl-16 md:pl-0 mt-4 md:mt-0 z-10 flex flex-col items-start md:items-start md:pt-1">
                                    <div className="inline-flex items-center">
                                        <span className="px-3 md:px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-[11px] md:text-xs font-bold tracking-widest uppercase">
                                            2016 - 2020
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-2 md:ml-2">
                                        JUNIOR HIGH SCHOOL
                                    </span>
                                </div>
                            </div>

                            {/* Item 4: Elementary */}
                            <div className="relative flex flex-col md:flex-row items-center justify-between group">
                                {/* Desktop Center Dot */}
                                <div
                                    className="absolute left-[27px] md:left-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10"
                                    style={{ transform: "translateX(-50%)" }}
                                >
                                    <div className="w-3.5 h-3.5 rounded-full bg-gray-300 dark:bg-gray-600 ring-[5px] ring-white dark:ring-[#111111]"></div>
                                </div>

                                {/* Content: Right for Desktop */}
                                <div className="order-1 md:order-2 w-full md:w-1/2 md:pl-12 pl-16 md:pl-0 z-10 flex flex-col items-start md:items-start">
                                    <h3 className="text-[1.35rem] md:text-[1.7rem] font-bold text-[#0B1528] dark:text-white leading-tight mb-1">
                                        Bagong Silang Elementary School
                                    </h3>
                                    <div className="flex items-center justify-start gap-1.5 text-gray-500 dark:text-gray-400 text-[15px]">
                                        <MapPin className="w-4 h-4 shrink-0" />
                                        <span>Elementary</span>
                                    </div>
                                </div>

                                {/* Meta: Left for Desktop */}
                                <div className="order-2 md:order-1 w-full md:w-1/2 md:pr-12 md:text-right pl-16 md:pl-0 mt-4 md:mt-0 z-10 flex flex-col items-start md:items-end md:pt-1">
                                    <div className="inline-flex items-center">
                                        <span className="px-3 md:px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-[11px] md:text-xs font-bold tracking-widest uppercase">
                                            2010 - 2016
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-2 md:mr-2">
                                        ELEMENTARY
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Divider */}
            <div className="w-full h-px bg-linear-to-r from-transparent via-sky-primary/20 to-transparent"></div>

            {/* Skills Section */}
            <section
                id="skills"
                ref={skillsRef}
                className={`relative py-24 bg-transparent transition-colors duration-300 reveal ${skillsIsVisible ? "visible" : ""
                    }`}
            >
                {/* Subtle background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-100 dark:bg-sky-900/10 rounded-full blur-3xl opacity-30"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900/10 rounded-full blur-3xl opacity-30"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    {/* Beautiful header */}
                    <div className="text-center mb-10 flex flex-col items-center">
                        <div className="inline-flex items-center gap-3 mb-3">
                            <span className="text-xl md:text-xl font-bold text-sky-primary tracking-[0.2em] uppercase">
                                Skills
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Tech Stack
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
                            The array of tools and frameworks I use to bring
                            ideas to life.
                        </p>
                    </div>

                    <CategoryToggle
                        categories={categories}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                    />

                    {/* Beautiful grid with better spacing */}
                    <div
                        key={activeCategory}
                        className="animate-fade-in-up"
                        style={{ animationDuration: "0.4s" }}
                    >
                        {activeCategory === "development" ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                                {/* Back-end Card */}
                                <div className="bg-white dark:bg-[#111111]/80 backdrop-blur-md rounded-[2rem] p-7 lg:p-8 shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/40 border border-gray-100 dark:border-white/5 flex flex-col h-full group hover:border-sky-500/30 transition-all duration-300">
                                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">
                                        Back-end Development
                                    </h3>
                                    <p className="text-gray-400 dark:text-gray-500 font-medium text-sm mb-4">
                                        Powering the engine behind the scenes
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400 italic text-xs mb-6 leading-relaxed max-w-sm">
                                        Building robust, scalable server-side
                                        applications and managing data
                                        efficiently.
                                    </p>
                                    <div className="flex flex-col gap-4 mt-auto">
                                        {getCurrentSkills()
                                            .filter((skill) => skill.type === "backend")
                                            .map((skill) => (
                                                <div key={`backend-${skill.name}`} className="flex items-center gap-3 group/skill">
                                                    <img src={skill.logo} alt={skill.name} className="w-6 h-6 object-contain group-hover/skill:scale-110 transition-transform duration-300 shrink-0" />
                                                    <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                                                        {skill.name}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Front-end Card */}
                                <div className="bg-white dark:bg-[#111111]/80 backdrop-blur-md rounded-[2rem] p-7 lg:p-8 shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/40 border border-gray-100 dark:border-white/5 flex flex-col h-full group hover:border-sky-500/30 transition-all duration-300">
                                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">
                                        Front-end Development
                                    </h3>
                                    <p className="text-gray-400 dark:text-gray-500 font-medium text-sm mb-4">
                                        Crafting beautiful interactive interfaces
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400 italic text-xs mb-6 leading-relaxed max-w-sm">
                                        Translating designs into responsive,
                                        high-performance user experiences.
                                    </p>
                                    <div className="flex flex-col gap-4 mt-auto">
                                        {getCurrentSkills()
                                            .filter((skill) => skill.type === "frontend")
                                            .map((skill) => (
                                                <div key={`frontend-${skill.name}`} className="flex items-center gap-3 group/skill">
                                                    <img src={skill.logo} alt={skill.name} className="w-6 h-6 object-contain group-hover/skill:scale-110 transition-transform duration-300 shrink-0" />
                                                    <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                                                        {skill.name}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                                {/* UI/UX Card */}
                                <div className="bg-white dark:bg-[#111111]/80 backdrop-blur-md rounded-[2rem] p-7 lg:p-8 shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/40 border border-gray-100 dark:border-white/5 flex flex-col h-full group hover:border-sky-500/30 transition-all duration-300">
                                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">
                                        UI/UX Design
                                    </h3>
                                    <p className="text-gray-400 dark:text-gray-500 font-medium text-sm mb-4">
                                        User-centric experiences
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400 italic text-xs mb-6 leading-relaxed">
                                        Focusing on intuitive flows, elegant
                                        visuals, and pixel-perfect attention to
                                        detail.
                                    </p>
                                    <div className="flex flex-col gap-4 mt-auto">
                                        {getCurrentSkills()
                                            .filter((skill) => skill.type === "ui")
                                            .map((skill) => (
                                                <div key={`ui-${skill.name}`} className="flex items-center gap-3 group/skill">
                                                    <img src={skill.logo} alt={skill.name} className="w-6 h-6 object-contain group-hover/skill:scale-110 transition-transform duration-300 shrink-0" />
                                                    <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                                                        {skill.name}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Tools Card */}
                                <div className="bg-white dark:bg-[#111111]/80 backdrop-blur-md rounded-[2rem] p-7 lg:p-8 shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/40 border border-gray-100 dark:border-white/5 flex flex-col h-full group hover:border-sky-500/30 transition-all duration-300">
                                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">
                                        Tools
                                    </h3>
                                    <p className="text-gray-400 dark:text-gray-500 font-medium text-sm mb-4">
                                        My workflow essentials
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400 italic text-xs mb-6 leading-relaxed">
                                        Version control, editors, and modern
                                        utilities that boost daily productivity.
                                    </p>
                                    <div className="flex flex-col gap-4 mt-auto">
                                        {getCurrentSkills()
                                            .filter((skill) => skill.type === "tool" || skill.type === "repository")
                                            .map((skill) => (
                                                <div key={`tool-${skill.name}`} className="flex items-center gap-3 group/skill">
                                                    <img src={skill.logo} alt={skill.name} className="w-6 h-6 object-contain group-hover/skill:scale-110 transition-transform duration-300 shrink-0" />
                                                    <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                                                        {skill.name}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Deployment Card */}
                                <div className="bg-white dark:bg-[#111111]/80 backdrop-blur-md rounded-[2rem] p-7 lg:p-8 shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/40 border border-gray-100 dark:border-white/5 flex flex-col h-full group hover:border-sky-500/30 transition-all duration-300">
                                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">
                                        Deployment
                                    </h3>
                                    <p className="text-gray-400 dark:text-gray-500 font-medium text-sm mb-4">
                                        Shipping code to production
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400 italic text-xs mb-6 leading-relaxed">
                                        Platforms and services used to host,
                                        scale, and deliver applications
                                        globally.
                                    </p>
                                    <div className="flex flex-col gap-4 mt-auto">
                                        {getCurrentSkills()
                                            .filter((skill) => skill.type === "deployment")
                                            .map((skill) => (
                                                <div key={`dep-${skill.name}`} className="flex items-center gap-3 group/skill">
                                                    <img src={skill.logo} alt={skill.name} className="w-6 h-6 object-contain group-hover/skill:scale-110 transition-transform duration-300 shrink-0" />
                                                    <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                                                        {skill.name}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Section Divider */}
            <div className="w-full h-px bg-linear-to-r from-transparent via-sky-primary/20 to-transparent"></div>

            {/* Projects Section */}
            <section
                id="projects"
                ref={projectsRef}
                className={`relative py-40 bg-transparent transition-colors duration-300 reveal ${projectsIsVisible ? "visible" : ""
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 flex flex-col items-center">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="text-xl md:text-xl font-bold text-sky-primary tracking-[0.2em] uppercase">
                                Projects
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-5">
                            Featured Projects
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl">
                            Some of the recent work I've built. Hover over any
                            project to reveal its details.
                        </p>
                    </div>

                    {/* Stacked Full-Width Project Cards */}
                    <div className="flex flex-col gap-8">
                        {projects.map((project, index) => {
                            const progressColor = project.progress === 100
                                ? "bg-emerald-500"
                                : project.progress >= 60
                                    ? "bg-amber-500"
                                    : project.progress >= 30
                                        ? "bg-orange-500"
                                        : "bg-red-500";

                            const statusColor = project.status === "Finished"
                                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/90 dark:bg-emerald-500/20 border-emerald-200/50 dark:border-emerald-500/30"
                                : project.status === "In Progress"
                                    ? "text-amber-600 dark:text-amber-400 bg-amber-50/90 dark:bg-amber-500/20 border-amber-200/50 dark:border-amber-500/30"
                                    : "text-red-600 dark:text-red-400 bg-red-50/90 dark:bg-red-500/20 border-red-200/50 dark:border-red-500/30";

                            const dotColor = project.status === "Finished"
                                ? "bg-emerald-500"
                                : project.status === "In Progress"
                                    ? "bg-amber-500 animate-pulse"
                                    : "bg-red-500 animate-pulse";

                            const animClass = projectsIsVisible
                                ? (index % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right')
                                : 'opacity-0';

                            return (
                                <div
                                    key={index}
                                    className={`bg-white/60 dark:bg-[#111111]/60 backdrop-blur-md border border-gray-100 dark:border-white/5 rounded-4xl overflow-hidden shadow-lg dark:shadow-2xl hover:shadow-xl hover:border-sky-500/20 transition-all duration-500 group ${animClass}`}
                                    style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
                                >
                                    <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                                        {/* Image Side with Status Badge overlay */}
                                        <div className="relative lg:w-1/2 h-64 lg:h-auto min-h-[320px] overflow-hidden">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                                            />
                                            {/* Status badge inside image — top-left with frosted glass */}
                                            <div className="absolute top-4 left-4 z-20">
                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md text-xs font-bold uppercase tracking-widest shadow-lg ${statusColor}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
                                                    {project.status}
                                                </div>
                                            </div>
                                            {/* Hover Blur Overlay */}
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center items-center p-8 text-center z-10">
                                                <p className="text-white/90 text-sm leading-relaxed max-w-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                                                    {project.desc}
                                                </p>
                                                <button className="mt-6 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white font-bold text-sm rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100 flex items-center gap-2 group/btn">
                                                    View Details
                                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Content Side */}
                                        <div className="flex flex-col justify-between p-8 lg:p-10 lg:w-1/2">
                                            {/* Title */}
                                            <div>
                                                <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 group-hover:text-sky-500 transition-colors duration-300">
                                                    {project.title}
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 line-clamp-2 lg:line-clamp-3">
                                                    {project.desc}
                                                </p>
                                            </div>

                                            {/* Tech Tags */}
                                            <div className="flex items-center gap-3 mb-8 flex-wrap">
                                                {project.tags.map((tag, tagIndex) => (
                                                    <div
                                                        key={tagIndex}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-full"
                                                    >
                                                        <img
                                                            src={tag.logo}
                                                            alt={tag.name}
                                                            className="w-4 h-4 object-contain"
                                                        />
                                                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                                            {tag.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Progress Bar */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">
                                                        Progress
                                                    </span>
                                                    <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                                                        {project.progress}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${progressColor} transition-all duration-1000 ease-out`}
                                                        style={{
                                                            width: `${project.progress}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center mt-16">
                        <a
                            href="https://github.com/kylleedriangalceran-ops?tab=repositories"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-sky-primary hover:bg-sky-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            View More Projects
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Section Divider */}
            <div className="w-full h-px bg-linear-to-r from-transparent via-sky-primary/20 to-transparent"></div>

            {/* Certs & Achievements Section */}
            <section
                id="achievements"
                ref={certsRef}
                className={`relative py-40 bg-transparent transition-colors duration-300 reveal ${certsIsVisible ? "visible" : ""}`}
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-100 dark:bg-amber-900/5 rounded-full blur-3xl opacity-20"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <SectionHeader
                        label="Achievements"
                        title="Certs & Recognition"
                        subtitle="Milestones in learning, growth, and academic excellence."
                        className="mb-16"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certs.map((cert, index) => (
                            <div
                                key={index}
                                className="group bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-black/40 border border-gray-100 dark:border-white/5 hover:border-sky-500/30 transition-all duration-300 flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-5">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${cert.color === "amber" ? "bg-amber-50 dark:bg-amber-900/20" : "bg-sky-50 dark:bg-sky-900/10"}`}>
                                        {cert.type === "Achievement" ? (
                                            <Trophy className={`w-6 h-6 ${cert.color === "amber" ? "text-amber-500" : "text-sky-500"}`} strokeWidth={1.5} />
                                        ) : (
                                            <Award className="w-6 h-6 text-sky-500" strokeWidth={1.5} />
                                        )}
                                    </div>
                                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${cert.type === "Achievement" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" : "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400"}`}>
                                        {cert.type}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 leading-snug">
                                    {cert.title}
                                </h3>
                                <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{cert.issuer} · {cert.date}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed grow">
                                    {cert.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section Divider */}
            <div className="w-full h-px bg-linear-to-r from-transparent via-sky-primary/20 to-transparent"></div>

            {/* Blog / Insights Section */}
            <section
                id="blog"
                ref={blogRef}
                className={`relative py-40 bg-transparent transition-colors duration-300 reveal ${blogIsVisible ? "visible" : ""}`}
            >
                <div className="relative max-w-7xl mx-auto px-6">
                    <SectionHeader
                        label="Blog"
                        title="Thoughts & Insights"
                        subtitle="Things I've learned, built, and thought deeply about."
                        className="mb-16"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {blogs.map((post, index) => (
                            <div
                                key={index}
                                className="group bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-black/40 border border-gray-100 dark:border-white/5 hover:border-sky-500/30 transition-all duration-300 flex flex-col cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <span className="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400">
                                        {post.category}
                                    </span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                                        {post.date}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-sky-primary transition-colors duration-200">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 grow">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-xs font-medium">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{post.readTime}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {post.tags.map((tag, i) => (
                                            <span key={i} className="text-[11px] px-2 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-md font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section Divider */}
            <div className="w-full h-px bg-linear-to-r from-transparent via-sky-primary/20 to-transparent"></div>

            {/* Testimonials Section */}
            <section
                id="testimonials"
                ref={testimonialsRef}
                className={`relative py-40 bg-transparent transition-colors duration-300 reveal ${testimonialsIsVisible ? "visible" : ""}`}
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-sky-100 dark:bg-sky-900/5 rounded-full blur-3xl opacity-20"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <SectionHeader
                        label="Testimonials"
                        title="What People Say"
                        subtitle="Feedback and reviews from visitors and collaborators."
                        className="mb-16"
                    />

                    <TestimonialCarousel testimonials={testimonials} />
                </div>
            </section>

            {/* Section Divider */}
            <div className="w-full h-px bg-linear-to-r from-transparent via-sky-primary/20 to-transparent"></div>

            {/* Visitor Stats + Rating Section */}
            <section className="py-16">
                <div className="max-w-2xl mx-auto px-6">
                    <div className="bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl overflow-hidden">
                        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-white/5">

                            {/* Visitor Count */}
                            <div className="flex items-center gap-4 px-8 py-6 sm:w-1/2">
                                <div className="w-11 h-11 rounded-full bg-sky-primary/10 dark:bg-sky-500/20 border border-sky-primary/20 flex items-center justify-center shrink-0">
                                    <Eye className="w-5 h-5 text-sky-primary" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                        {totalVisits.toLocaleString()}
                                    </p>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Portfolio Visitors
                                    </p>
                                </div>
                            </div>

                            {/* Star Rating */}
                            <div className="flex flex-col items-center justify-center px-8 py-6 sm:w-1/2 gap-2">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {hasRated ? "Your rating" : "Rate this portfolio"}
                                </p>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleRate(star)}
                                            onMouseEnter={() => !hasRated && setHoverStar(star)}
                                            onMouseLeave={() => setHoverStar(0)}
                                            disabled={hasRated}
                                            className="transition-transform hover:scale-125 active:scale-95 disabled:cursor-default"
                                            style={{ transition: "transform 0.15s cubic-bezier(0.34,1.56,0.64,1)" }}
                                        >
                                            <Star
                                                className={`w-7 h-7 transition-colors duration-150 ${star <= (hoverStar || submittedRating)
                                                    ? "text-amber-400"
                                                    : "text-gray-300 dark:text-gray-600"
                                                    }`}
                                                strokeWidth={1.5}
                                                fill={star <= (hoverStar || submittedRating) ? "currentColor" : "none"}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                                    {hasRated
                                        ? `Thanks! ${liveAvg > 0 ? `${liveAvg} avg · ${liveTotal} ratings` : ""}`
                                        : liveTotal > 0
                                            ? `${liveAvg} avg · ${liveTotal} ${liveTotal === 1 ? "rating" : "ratings"}`
                                            : "Be the first to rate"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Divider */}
            <div className="w-full h-px bg-linear-to-r from-transparent via-sky-primary/20 to-transparent"></div>

            {/* Footer Contact Section */}
            <footer
                id="contact"
                className="relative overflow-hidden bg-transparent"
            >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>

                <div className="relative max-w-5xl mx-auto px-6 py-24">
                    <div className="text-center mb-16 flex flex-col items-center">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="text-xl md:text-2xl font-bold text-sky-primary tracking-[0.2em] uppercase">
                                Contact
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Let's Work Together!
                        </h2>
                    </div>

                    <div className="max-w-2xl mx-auto mb-20">
                        <ContactForm />
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            <a
                                href="mailto:kylleedrian71@gmail.com"
                                className="group flex items-center gap-4 p-5 rounded-2xl bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md border border-sky-100/50 dark:border-sky-900/20 hover:border-sky-primary transition-all duration-300 shadow-sm shadow-sky-100/50 dark:shadow-none"
                            >
                                <div className="w-12 h-12 rounded-full bg-sky-primary/10 dark:bg-sky-primary/20 flex items-center justify-center shrink-0 group-hover:bg-sky-primary/20 dark:group-hover:bg-sky-primary/30 transition-colors">
                                    <Mail
                                        className="w-5 h-5 text-sky-primary"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                        Email
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        kylleedrian71@gmail.com
                                    </p>
                                </div>
                            </a>

                            <a
                                href="tel:09454416649"
                                className="group flex items-center gap-4 p-5 rounded-2xl bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md border border-sky-100/50 dark:border-sky-900/20 hover:border-sky-primary transition-all duration-300 shadow-sm shadow-sky-100/50 dark:shadow-none"
                            >
                                <div className="w-12 h-12 rounded-full bg-sky-primary/10 dark:bg-sky-primary/20 flex items-center justify-center shrink-0 group-hover:bg-sky-primary/20 dark:group-hover:bg-sky-primary/30 transition-colors">
                                    <Phone
                                        className="w-5 h-5 text-sky-primary"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                        Phone
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        0945 441 6649
                                    </p>
                                </div>
                            </a>
                        </div>
                        <div className="text-center mb-12">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-6">
                                Connect With Me
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <a
                                    href="https://github.com/Kyllee-Galceran"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-11 h-11 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-sky-primary hover:text-sky-primary dark:hover:border-sky-primary dark:hover:text-sky-primary transition-all duration-300"
                                >
                                    <Github
                                        className="w-5 h-5"
                                        strokeWidth={1.5}
                                    />
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/kylle-edrian-galceran-7835162b7/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-11 h-11 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-sky-primary hover:text-sky-primary dark:hover:border-sky-primary dark:hover:text-sky-primary transition-all duration-300"
                                >
                                    <Linkedin
                                        className="w-5 h-5"
                                        strokeWidth={1.5}
                                    />
                                </a>
                                <a
                                    href="https://www.facebook.com/kylle.edrian.9/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-11 h-11 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-sky-primary hover:text-sky-primary dark:hover:border-sky-primary dark:hover:text-sky-primary transition-all duration-300"
                                >
                                    <Facebook
                                        className="w-5 h-5"
                                        strokeWidth={1.5}
                                    />
                                </a>
                                <a
                                    href="https://www.instagram.com/kyyyllee_/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-11 h-11 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-sky-primary hover:text-sky-primary dark:hover:border-sky-primary dark:hover:text-sky-primary transition-all duration-300"
                                >
                                    <Instagram
                                        className="w-5 h-5"
                                        strokeWidth={1.5}
                                    />
                                </a>
                            </div>
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-8"></div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                &copy; {new Date().getFullYear()}{" "}
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth",
                                        });
                                    }}
                                    className="font-semibold text-sky-primary hover:text-sky-600 transition-colors"
                                >
                                    KE Galceran
                                </a>
                                . Crafted with passion.
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                <a
                                    href="/admin/dashboard"
                                    className="hover:text-sky-primary transition-colors"
                                >
                                    Admin
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </Layout>
    );
}
