
"use client";

import "./global.css";
import NavBar from "./components/navigation/NavBar.component";
import Footer from "./components/navigation/Footer.component";

import { useEffect, useState } from "react";

import darkbg from "../public/images/backgrounds/mountain-1.jpg";
import lightbg from "../public/images/backgrounds/mountain-0.jpg";


export default function RootLayout({ children }) {

    const [backgroundImage, setBackgroundImage] = useState("");
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const backgroundSrc = darkMode ? darkbg.src : lightbg.src;
            setBackgroundImage(`url(${backgroundSrc})`);
        }
    }, [darkMode]);

    return (
        <html lang="en">

            <body
                className={`bg-cover bg-no-repeat ${darkMode ? "dark" : ""}`}
                style={{ backgroundImage }}
            >

                <NavBar
                    darkMode={darkMode}
                    setDarkMode={setDarkMode} />

                <div className="p-10 sm:px-20 md:px-40 lg:px-60 -z-10">{children}</div>

                <Footer />


            </body>

        </html >
    );
}