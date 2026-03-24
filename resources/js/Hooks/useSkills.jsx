import { useState } from "react";

export default function useSkills() {
    const [activeCategory, setActiveCategory] = useState("development");

    const skillsData = {
        development: [
            {
                name: "React.js",
                logo: "/images/logos/react.png",
                type: "frontend",
            },
            {
                name: "Vue.js",
                logo: "/images/logos/vuee.png",
                type: "frontend",
            },
            {
                name: "JavaScript",
                logo: "/images/logos/JS.png",
                type: "frontend",
            },
            {
                name: "HTML5",
                logo: "/images/logos/html5.png",
                level: "Expert",
                type: "frontend",
            },
            {
                name: "CSS3",
                logo: "/images/logos/css.png",
                level: "Advanced",
                type: "frontend",
            },
            {
                name: "TailwindCSS",
                logo: "/images/logos/tailwind.png",
                type: "frontend",
            },
            {
                name: "BootstrapCSS",
                logo: "/images/logos/bootstrap.png",
                type: "frontend",
            },
            {
                name: "Next.js",
                logo: "/images/logos/next.png",
                type: "frontend",
            },
            {
                name: "Python",
                logo: "/images/logos/python.png",
                type: "backend",
            },
            {
                name: "Node.js",
                logo: "/images/logos/node.png",
                type: "backend",
            },
            {
                name: "Laravel",
                logo: "/images/logos/laravel.png",
                type: "backend",
            },
            {
                name: "MySQL",
                logo: "/images/logos/MySQL.png",
                type: "backend",
            },
            {
                name: "PostgreSQL",
                logo: "/images/logos/postgre.png",
                type: "backend",
            },
            {
                name: "Django",
                logo: "/images/logos/django.png",
                type: "backend",
            },
            {
                name: "MongoDB",
                logo: "/images/logos/MongoDB.png",
                type: "backend",
            },
            {
                name: "Inertia.js",
                logo: "/images/logos/inertia.png",
                type: "backend",
            },
        ],
        design: [
            {
                name: "Figma",
                logo: "/images/logos/figma.png",
                type: "ui",
            },
            {
                name: "Canva",
                logo: "/images/logos/Canva.png",
                type: "ui",
            },
            {
                name: "draw.io",
                logo: "/images/logos/draw.png",
                type: "ui",
            },
            {
                name: "Git",
                logo: "/images/logos/Git.png",
                type: "tool",
            },
            {
                name: "GitHub",
                logo: "/images/logos/GitHub.png",
                type: "tool",
            },
            {
                name: "VS Code",
                logo: "/images/logos/VS.png",
                type: "tool",
            },
            {
                name: "Postman",
                logo: "/images/logos/Postman.png",
                type: "tool",
            },
            {
                name: "Vercel",
                logo: "/images/logos/Vercel.png",
                type: "deployment",
            },
        ],
    };

    const categories = [
        {
            id: "development",
            label: "Development",
            count: skillsData.development.length,
        },
        {
            id: "design",
            label: "Design & Tools",
            count: skillsData.design.length,
        },
    ];

    const getCurrentSkills = () => skillsData[activeCategory] || [];

    return {
        activeCategory,
        setActiveCategory,
        categories,
        getCurrentSkills,
        skillsData,
    };
}
