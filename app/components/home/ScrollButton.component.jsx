"use client"

import React from 'react';

export default function ScrollButton({ className, elementID, children }) {
    const scrollToSection = () => {
        const targetElement = document.getElementById(elementID);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <button onClick={scrollToSection} className={className}>{children}</button>
    );
}

