"use client";

import Link from "next/link";

import Toggle from "./Toggle.component";
import ScrollButton from "../home/ScrollButton.component";

import HamburgerIcon from "../icons/Hamburger.icon";
import CrossIcon from "../icons/Cross.icon";

import { useState } from "react";


export default function NavBar({ darkMode, setDarkMode }) {

    const [navOpen, setNavOpen] = useState(false);

    function toggleNavOpen() {
        setNavOpen(!navOpen);
    }

    return (
        <nav className="sticky top-0 lg:-top-20 w-full z-40 text-slate-600 dark:text-blue-100 py-10 px-5 sm:px-10 md:px-16 lg:pt-28 lg:px-28 flex flex-col lg:flex-row font-mono lowercase text-2xl gap-20 sm:gap-60 lg:gap-0 backdrop-blur-lg print:hidden">

            <div className={`${navOpen ? "" : "hidden"} lg:hidden z-10 absolute w-screen h-screen left-0 top-0 dark:bg-black bg-white max-lg:touch-none`}> </div>

            <div className="z-20 max-lg:touch-none flex flex-row justify-between place-items-center">


                <ScrollButton
                    onClick={toggleNavOpen}>

                    simrit&nbsp;nijjar
                </ScrollButton>


                {navOpen ?

                    <CrossIcon
                        className="dark:fill-white fill-black lg:hidden hover:cursor-pointer"
                        onClick={toggleNavOpen} />
                    :
                    <HamburgerIcon
                        className="dark:fill-white fill-black lg:hidden hover:cursor-pointer"
                        onClick={toggleNavOpen} />
                }

            </div>


            <div className={`${navOpen ? "" : "max-lg:hidden"}  flex flex-col lg:flex-row lg:basis-4/6 justify-center lg:justify-end gap-40 lg:gap-10 flex-grow max-lg:touch-none z-20`}>

                <div className="flex flex-col lg:flex-row gap-10 lg:justify-end">

                    <ScrollButton
                        elementID={`projects`}
                        className={`hover:line-through max-lg:touch-none text-center`}
                        onClick={toggleNavOpen}>

                        project
                    </ScrollButton>

                    <ScrollButton
                        elementID={`courses`}
                        className={`hover:line-through max-lg:touch-none text-center`}
                        onClick={toggleNavOpen}>
                        courses
                    </ScrollButton>

                    <ScrollButton
                        elementID={`about`}
                        className={`hover:line-through max-lg:touch-none text-center`}
                        onClick={toggleNavOpen}>
                        about
                    </ScrollButton>

                    <Link
                        onClick={toggleNavOpen}
                        href={"/resume"}
                        className={`hover:line-through max-lg:touch-none text-center`}
                    > resume </Link >






                </div>

                <div className="flex items-center justify-center">

                    <Toggle
                        darkMode={darkMode}
                        setDarkMode={setDarkMode} />

                </div>


            </div>

        </nav >
    )
}