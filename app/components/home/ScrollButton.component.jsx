"use client"

import React from 'react';

import { useRouter } from 'next/navigation';

export default function ScrollButton({ className, onClick, elementID, children }) {

    const router = useRouter();

    const scrollToSection = async () => {

        router.push(`/#${elementID}`);

        { onClick && onClick() };

    };

    return (
        <button onClick={scrollToSection} className={className} > {children}</button>
    );
}

