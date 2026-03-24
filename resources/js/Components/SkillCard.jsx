import React from 'react';

export default function SkillCard({ skill, index }) {
    const getLevelColor = (level) => {
        switch (level) {
            case 'Expert':
                return 'text-emerald-600 dark:text-emerald-400';
            case 'Advanced':
                return 'text-blue-600 dark:text-blue-400';
            case 'Intermediate':
                return 'text-amber-600 dark:text-amber-400';
            case 'Beginner':
                return 'text-gray-600 dark:text-gray-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    return (
        <div
            className="group bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-gray-100 dark:hover:shadow-gray-900/20"
            style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
            }}
        >
            <div className="flex flex-col items-center text-center space-y-6">
                {/* Logo with beautiful background */}
                <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        <img
                            src={skill.logo}
                            alt={skill.name}
                            className="w-12 h-12 object-contain"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        {/* Fallback icon */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-xl hidden">
                            {skill.name.charAt(0)}
                        </div>
                    </div>
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                {/* Skill name with beautiful typography */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg tracking-tight">
                        {skill.name}
                    </h3>

                    {/* Level with beautiful styling */}
                    <span className={`text-sm font-medium ${getLevelColor(skill.level)}`}>
                        {skill.level}
                    </span>
                </div>
            </div>
        </div>
    );
}
