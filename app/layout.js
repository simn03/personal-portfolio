
"use client";

import "./global.css";
import NavBar from "./components/navigation/NavBar.component";
import Footer from "./components/navigation/Footer.component";

import { useState } from "react";


import localFont from '@next/font/local'

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

const EditorialNew = localFont({
    src: [
        {
            path: '../public/fonts/PPEditorialNew/Regular.otf',
            weight: '400',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPEditorialNew/Italic.otf',
            weight: '400',
            style: 'italic'
        },
        {
            path: '../public/fonts/PPEditorialNew/Ultralight.otf',
            weight: '200',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPEditorialNew/Ultralightitalic.otf',
            weight: '200',
            style: 'italic'
        },
        {
            path: '../public/fonts/PPEditorialNew/Ultrabold.otf',
            weight: '800',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPEditorialNew/Ultrabolditalic.otf',
            weight: '800',
            style: 'italic'
        }
    ],
    variable: '--font-EditorialNew'
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

    return (
        <html l
            ang="en"
            className={`${darkMode ? "dark" : ""}`}>

            <body className={`bg-white dark:bg-black ${NeueMachina.variable} ${EditorialNew.variable} ${Writer.variable} font-sans`}>

                <NavBar
                    darkMode={darkMode}
                    setDarkMode={setDarkMode} />

                <div className="p-10 sm:px-20 md:px-40 lg:px-60 -z-10">{children}</div>

                <Footer />


            </body>

        </html >
    );
}