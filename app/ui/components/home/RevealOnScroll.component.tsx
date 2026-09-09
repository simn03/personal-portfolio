"use client"

import React, { useEffect, useRef, useState } from "react";

type RevealOnScrollProps = {
    children: React.ReactNode,
    className?: string
}

export default function RevealOnScroll({ children, className }: RevealOnScrollProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;

        if (!element || !("IntersectionObserver" in window)) {
            setIsVisible(true);
            return;
        }

        const scrollObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                scrollObserver.unobserve(entry.target);
            }
        });

        scrollObserver.observe(element);

        return () => scrollObserver.disconnect();
    }, []);

    // The observer progressively enhances the page; it never gates portfolio data.
    const classes = isVisible ? "animate-fade animate-once animate-ease-in" : "";

    return (
        <div ref={ref} className={classes + ' ' + className}>
            {children}
        </div>
    );
};
