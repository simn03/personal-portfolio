import Link from "next/link";

export default function NavBar() {



    return (
        <nav className="text-xl p-10 flex justify-end gap-10">
            <Link href={"/"} className="text-black font-mono hover:line-through"> home </Link >

            <Link href={"/about"} className="text-black font-mono hover:line-through"> about </Link >
        </nav>
    )
}