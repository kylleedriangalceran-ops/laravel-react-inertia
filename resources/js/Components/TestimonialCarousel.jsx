import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, User } from "lucide-react";

const TestimonialCarousel = ({ testimonials = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expandedComments, setExpandedComments] = useState({});
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-slide functionality
    useEffect(() => {
        if (!isAutoPlaying || testimonials.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000); // 5 seconds per slide

        return () => clearInterval(interval);
    }, [isAutoPlaying, testimonials.length]);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setIsAutoPlaying(false);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        setIsAutoPlaying(false);
    };

    const toggleReadMore = (index) => {
        setExpandedComments((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    if (!testimonials || testimonials.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                No testimonials yet. Be the first to share your thoughts!
            </div>
        );
    }

    const currentTestimonial = testimonials[currentIndex];
    const isExpanded = expandedComments[currentIndex];
    const shouldTruncate = currentTestimonial.comment.length > 200;
    const displayComment = isExpanded || !shouldTruncate
        ? currentTestimonial.comment
        : currentTestimonial.comment.substring(0, 200) + "...";

    return (
        <div className="relative max-w-4xl mx-auto">
            {/* Main Testimonial Card */}
            <div className="bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md rounded-[2.5rem] p-10 md:p-12 shadow-xl shadow-gray-200/50 dark:shadow-black/40 border border-gray-100 dark:border-white/5 transition-all duration-500">
                {/* Header: Avatar, Name, Date, Stars */}
                <div className="flex items-start gap-4 mb-6">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                        <User className="w-7 h-7 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
                    </div>

                    {/* Name, Date, and Stars */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                {currentTestimonial.name}
                            </h4>
                            <span className="text-gray-400 dark:text-gray-500">•</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(currentTestimonial.date).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                })}
                            </p>
                        </div>
                        {/* Star Rating */}
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 transition-colors ${star <= currentTestimonial.rating
                                        ? "text-amber-400"
                                        : "text-gray-300 dark:text-gray-600"
                                        }`}
                                    strokeWidth={1.5}
                                    fill={star <= currentTestimonial.rating ? "currentColor" : "none"}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Comment Text */}
                <div className="text-left">
                    <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                        {displayComment}
                    </p>
                    {shouldTruncate && (
                        <button
                            onClick={() => toggleReadMore(currentIndex)}
                            className="mt-3 text-sm font-semibold text-sky-primary hover:text-sky-600 dark:hover:text-sky-300 transition-colors"
                        >
                            {isExpanded ? "Read less" : "Read more"}
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation Controls */}
            {testimonials.length > 1 && (
                <>
                    <button
                        onClick={goToPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 rounded-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 hover:border-sky-primary dark:hover:border-sky-primary shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-sky-primary dark:hover:text-sky-primary transition-all duration-300 hover:scale-110"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 rounded-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 hover:border-sky-primary dark:hover:border-sky-primary shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-sky-primary dark:hover:text-sky-primary transition-all duration-300 hover:scale-110"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {testimonials.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentIndex(index);
                                setIsAutoPlaying(false);
                            }}
                            className={`transition-all duration-300 rounded-full ${index === currentIndex
                                ? "w-8 h-2 bg-sky-primary"
                                : "w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-sky-primary/50"
                                }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TestimonialCarousel;
