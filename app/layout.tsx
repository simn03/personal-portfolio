
"use client";

import "./global.css";
import NavBar from "./ui/components/navigation/NavBar.component";
import Footer from "./ui/components/navigation/Footer.component";

import HoverBG from "./ui/components/home/HoverBG.component";

import { useState, useEffect } from "react";

import localFont from 'next/font/local'

import {MousePosition} from "./lib/Definitions";


const NeueMachina = localFont({
    src: [
        {
            path: '../public/fonts/PPNeueMachina/PlainLight.woff2',
            weight: '300',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPNeueMachina/PlainLightItalic.woff2',
            weight: '300',
            style: 'italic'
        },
        {
            path: '../public/fonts/PPNeueMachina/PlainRegular.woff2',
            weight: '375',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPNeueMachina/PlainRegularItalic.woff2',
            weight: '375',
            style: 'italic'
        },
        {
            path: '../public/fonts/PPNeueMachina/PlainUltrabold.woff2',
            weight: '800',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPNeueMachina/PlainUltraboldItalic.woff2',
            weight: '800',
            style: 'italic'
        }
    ],
    variable: '--font-NeueMachina'
})

const Writer = localFont({
    src: [
        {
            path: '../public/fonts/PPWriter/BlackItalic.otf',
            weight: '900',
            style: 'italic'
        },
        {
            path: '../public/fonts/PPWriter/Bold.otf',
            weight: '700',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPWriter/BoldItalic.otf',
            weight: '700',
            style: 'italic'
        },
        {
            path: '../public/fonts/PPWriter/Book.otf',
            weight: '340',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPWriter/Regular.otf',
            weight: '400',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPWriter/Thin.otf',
            weight: '100',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPWriter/Ultrabold.otf',
            weight: '800',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPWriter/UltraboldItalic.otf',
            weight: '800',
            style: 'italic'
        }
    ],
    variable: '--font-Writer'
})



export default function RootLayout({ children }) {

    const [darkMode, setDarkMode] = useState(true);
    const [mousePos, setMousePos] = useState({} as MousePosition);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {

        setDarkMode(localStorage.getItem("darkMode") === "true");

        const handleMouseMove = (event) => {
            setMousePos({ x: event.clientX, y: event.clientY });

        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener(
                'mousemove',
                handleMouseMove
            );
        };
    }, []);


    function handleMouseClick() {
        setIsVisible(true);

        setTimeout(() => {
            setIsVisible(false);
        }, 500);

    }

    return (
        <html lang="en"
            className={`${darkMode ? "dark" : ""} h-screen overflow-y-scroll md:snap-y scroll-p-32 scroll-smooth`}
            onClick={handleMouseClick}>


            <body className={`dark:bg dark:bg-slate-900 transition-color duration-150 font-sans ${NeueMachina.variable} ${Writer.variable} `}>

                <NavBar
                    darkMode={darkMode}
                    setDarkMode={setDarkMode} />

                <HoverBG x={mousePos.x} y={mousePos.y} isVisible={isVisible} />

                <div className="document-padding -z-10">{children}</div>

                <Footer />


            </body>

        </html >
    );
}