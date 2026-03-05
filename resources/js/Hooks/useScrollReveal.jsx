import { useEffect, useRef, useState } from 'react';

export default function useScrollReveal(options = { threshold: 0.1, triggerOnce: true }) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const currentRef = ref.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (options.triggerOnce) {
                    observer.unobserve(currentRef);
                }
            } else if (!options.triggerOnce) {
                setIsVisible(false);
            }
        }, options);

        observer.observe(currentRef);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [options.threshold, options.triggerOnce]);

    return [ref, isVisible];
}
