import Link from "next/link";

import Cursor from "../home/Cursor.component.jsx";

import Toggle from "./Toggle.component.jsx";

export default function NavBar({ darkMode, setDarkMode }) {

    return (
        <nav className="text-black dark:text-blue-100 p-10 md:p-28 flex flex-col md:flex-row font-mono lowercase text-2xl md:basis-2/6 gap-5 md:gap-0">

            <Link href={'/'}> Simrit&nbsp;Nijjar<Cursor /> </Link >

            <div className="flex flex-row gap-10 flex-grow md:justify-end md:basis-3/6 md:mr-10">

                <Link href={"/resume"} className="hover:line-through"> resume </Link >

                <Link href={"/about"} className="hover:line-through"> about </Link >

            </div>

            <Toggle
                className="md:basis-1/6"
                darkMode={darkMode}
                setDarkMode={setDarkMode} />

        </nav>
    )
}