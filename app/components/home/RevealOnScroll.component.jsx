"use client"

import React, { useEffect, useRef, useState } from "react";

export default function RevealOnScroll({ children, className }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                // scrollObserver.unobserve(entry.target);
            } else {
                setIsVisible(false);
            }
        });

        scrollObserver.observe(ref.current);

        // return () => {
        //     if (ref.current) {
        //         scrollObserver.unobserve(ref.current);
        //     }
        // };
    }, []);

    const classes = `${isVisible ? "animate-fade animate-once animate-ease-in" : "opacity-0"}`;

    return (
        <div ref={ref} className={classes + ' ' + className}>
            {children}
        </div>
    );
};
