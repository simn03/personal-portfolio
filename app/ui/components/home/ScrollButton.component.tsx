"use client"

import React from 'react';

import {useRouter} from 'next/navigation';

type ScrollButtonProps = {
    className?: string,
    onClick?: () => void,
    elementID?: string,
    children: React.ReactNode
}

export default function ScrollButton({className, onClick, elementID, children}: ScrollButtonProps) {

    const router = useRouter();

    const scrollToSection = async () => {

        router.push(`/#${elementID}`);

        onClick?.();

    };

    return (
        <button onClick={scrollToSection} className={className} > {children}</button>
    );
}
