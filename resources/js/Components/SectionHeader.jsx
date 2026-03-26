export default function SectionHeader({ label, title, subtitle, className = "" }) {
    return (
        <div className={`text-center flex flex-col items-center ${className}`}>
            <div className="inline-flex items-center gap-3 mb-4">
                <span className="text-xl font-bold text-sky-primary tracking-[0.2em] uppercase">
                    {label}
                </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className="text-gray-500 dark:text-gray-400 text-lg">{subtitle}</p>
            )}
        </div>
    );
}
