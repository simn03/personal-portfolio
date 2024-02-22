"use client"

import React from 'react';

import { useRouter } from 'next/navigation';

type ScrollButtonProps = {
    className?: string,
    onClick: Function,
    elementID?: string,
    children: React.ReactNode
}

export default function ScrollButton({ className, onClick, elementID, children } : ScrollButtonProps) {

    const router = useRouter();

    const scrollToSection = async () => {

        router.push(`/#${elementID}`);

        { onClick && onClick() };

    };

    return (
        <button onClick={scrollToSection} className={className} > {children}</button>
    );
}

