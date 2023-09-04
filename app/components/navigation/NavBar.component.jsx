"use client";

import Link from "next/link";

import Cursor from "../home/Cursor.component.jsx";

import Toggle from "./Toggle.component.jsx";

import HamburgerIcon from "../icons/Hamburger.icon.jsx";
import CrossIcon from "../icons/Cross.icon.jsx";

import { useState } from "react";


export default function NavBar({ darkMode, setDarkMode }) {

    const [navOpen, setNavOpen] = useState(false);

    function toggleNavOpen() {
        setNavOpen(!navOpen);
    }

    return (
        <nav className="sticky top-0 md:-top-20 w-full z-40 text-slate-600 dark:text-blue-100 p-10 md:pt-28 md:px-28 flex flex-col md:flex-row font-mono lowercase text-2xl gap-40 md:gap-0 backdrop-blur-lg print:hidden">

            <div className={`${navOpen ? "" : "hidden"} md:hidden z-10 absolute w-screen h-screen left-0 top-0 dark:bg-black bg-white max-md:touch-none`}> </div>

            <div className="z-20 max-md:touch-none flex flex-row justify-between place-items-center">

                <Link
                    href={'/'}
                    onClick={navOpen ? toggleNavOpen : ""}
                >
                    Simrit&nbsp;Nijjar<Cursor />
                </Link >

                {navOpen ?

                    <CrossIcon
                        className="dark:fill-white fill-black md:hidden hover:cursor-pointer"
                        onClick={toggleNavOpen} />
                    :
                    <HamburgerIcon
                        className="dark:fill-white fill-black md:hidden hover:cursor-pointer"
                        onClick={toggleNavOpen} />
                }

            </div>


            <div className={`${navOpen ? "" : "max-md:hidden"}  flex flex-col md:flex-row md:basis-4/6 justify-center md:justify-end gap-40 md:gap-10 flex-grow max-md:touch-none z-20`}>

                <div className="flex flex-col md:flex-row gap-10 md:justify-end">

                    <Link
                        onClick={toggleNavOpen}
                        href={"/resume"}
                        className={`hover:line-through max-md:touch-none text-center`}
                    > resume </Link >

                    <Link
                        onClick={toggleNavOpen}
                        href={"/about"}
                        className={`hover:line-through max-md:touch-none text-center`}
                    > about </Link >

                </div>

                <div className="flex items-center justify-center">

                    <Toggle
                        darkMode={darkMode}
                        setDarkMode={setDarkMode} />

                </div>


            </div>

        </nav>
    )
}