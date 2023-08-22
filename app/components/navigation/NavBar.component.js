import Link from "next/link";

import Cursor from "../home/Cursor.component";


export default function NavBar() {

    return (
        <nav className=" p-10 md:p-16 flex flex-col md:flex-row font-mono lowercase text-2xl md:basis-2/6">

            <Link href={'/'}> Simrit&nbsp;Nijjar<Cursor /> </Link >

            <div className="text-black flex flex-row gap-10 flex-grow md:justify-end md:basis-4/6">

                <Link href={"/resume"} className="hover:line-through"> resume </Link >

                <Link href={"/about"} className="hover:line-through"> about </Link >

            </div>
        </nav>
    )
}