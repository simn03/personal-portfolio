"use client";

import Link from "next/link";

import Cursor from "../home/Cursor.component.jsx";

import Toggle from "./Toggle.component.jsx";

import Image from "next/image.js";

import LightHamburger from "../../../public/icons/hamburger-light.svg";
import DarkHamburger from "../../../public/icons/hamburger-dark.svg";

import LightClose from "../../../public/icons/close-light.svg";
import DarkClose from "../../../public/icons/close-dark.svg";

import { useEffect, useState } from "react";


export default function NavBar({ darkMode, setDarkMode }) {

    const [navOpen, setNavOpen] = useState(false);
    const [hamburger, setHamburger] = useState(LightHamburger);

    function toggleNavOpen() {
        setNavOpen(!navOpen);
    }

    useEffect(() => {
        if (darkMode) {
            if (navOpen) {
                setHamburger(LightClose)
            } else {
                setHamburger(DarkHamburger)
            }
        } else {
            if (navOpen) {
                setHamburger(DarkClose)
            } else {
                setHamburger(LightHamburger)
            }
        }
    }, [navOpen, darkMode])




    return (
        <nav className="max-md:dark:text-white md:text-blue-100 p-10 md:p-28 flex flex-col md:flex-row font-mono lowercase text-2xl gap-40 md:gap-0 ">

            <div className={`${navOpen ? "" : "hidden"} md:hidden z-10 fixed inset-0 w-full h-full left-0 top-0 dark:bg-black bg-white max-md:touch-none`}> </div>

            <div className="z-20 max-md:touch-none flex flex-row justify-between ">

                <Link href={'/'} className=""> Simrit&nbsp;Nijjar<Cursor /> </Link >

                <Image alt="Hamburger" src={hamburger} height={50} width={50} color="white" style={{ fill: "white " }} onClick={toggleNavOpen} className=" fill-white stroke-white md:hidden" />


            </div>


            <div className={`${navOpen ? "" : "max-md:hidden"}  flex flex-col md:flex-row md:basis-4/6 justify-center md:justify-end gap-40 md:gap-10 flex-grow max-md:touch-none z-20`}>

                <div className="flex flex-col md:flex-row gap-10 md:justify-end">

                    <Link onClick={toggleNavOpen} href={"/resume"} className="hover:line-through max-md:touch-none text-center"> resume </Link >

                    <Link onClick={toggleNavOpen} href={"/about"} className="hover:line-through max-md:touch-none text-center"> about </Link >

                </div>

                <div className="flex items-center justify-center">

                    <Toggle
                        className=""
                        darkMode={darkMode}
                        setDarkMode={setDarkMode} />

                </div>


            </div>

        </nav>
    )
}