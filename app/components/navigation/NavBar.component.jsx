"use client";

import Link from "next/link";

import Cursor from "../home/Cursor.component.jsx";

import Toggle from "./Toggle.component.jsx";


import { useState } from "react";


export default function NavBar({ darkMode, setDarkMode }) {

    const [navOpen, setNavOpen] = useState(false);

    function toggleNavOpen() {
        setNavOpen(!navOpen);
    }

    return (
        <nav className="text-slate-600 dark:text-blue-100 p-10 md:p-28 flex flex-col md:flex-row font-mono lowercase text-2xl gap-40 md:gap-0 ">

            <div className={`${navOpen ? "" : "hidden"} md:hidden z-10 absolute inset-0 w-[100vw] h-[100vh] left-0 top-0 dark:bg-black bg-white max-md:touch-none`}> </div>

            <div className="z-20 max-md:touch-none flex flex-row justify-between place-items-center">

                {navOpen ?
                    <Link
                        href={'/'}
                        onClick={toggleNavOpen}
                    >
                        Simrit&nbsp;Nijjar<Cursor />
                    </Link >
                    :
                    <Link
                        href={'/'}
                    >
                        Simrit&nbsp;Nijjar<Cursor />
                    </Link >
                }

                {navOpen ?

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        viewBox="0 0 50 50"
                        className="dark:fill-white fill-black md:hidden hover:cursor-pointer"
                        onClick={toggleNavOpen}
                    >
                        <path d="M9.156 6.313L6.312 9.155 22.157 25 6.22 40.969 9.03 43.78 25 27.844 40.938 43.78l2.843-2.843L27.844 25 43.687 9.156l-2.843-2.844L25 22.157z"></path>
                    </svg>
                    :
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        viewBox="0 0 256 256"
                        className="dark:fill-white fill-black md:hidden hover:cursor-pointer"
                        onClick={toggleNavOpen}
                    >
                        <path
                            strokeMiterlimit="10"
                            d="M5 8a2 2 0 100 4h40a2 2 0 100-4zm0 15a2 2 0 100 4h40a2 2 0 100-4zm0 15a2 2 0 100 4h40a2 2 0 100-4z"
                            fontFamily="none"
                            fontSize="none"
                            fontWeight="none"
                            textAnchor="none"
                            transform="scale(5.12)"
                        ></path>
                    </svg>

                }

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