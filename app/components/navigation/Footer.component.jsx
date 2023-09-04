import Link from "next/link";

export default function Footer() {
    return (
        <footer className="z-20 print:hidden px-10 md:px-40 py-6 bg-primary text-background flex flex-col md:flex-row place-items-center md:justify-evenly">
            <div>
                <small className="opacity-50">&copy; 2023 Copyright: Simrit Nijjar</small>
            </div>
        </footer>
    )
}