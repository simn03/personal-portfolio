"use client"

import { use, useEffect, useState } from "react";
import Cursor from "./Cursor.component";


export default function TypeEffect({ className, phrase, phrases }) {

    let i = 0;

    let [currentPhrase, setCurrentPhrase] = useState(phrases[i]);
    let isDeleting = false;

    let j = currentPhrase.length;

    const type = () => {

        if (i == (phrases.length - 1)) {
            i = 0;
        }

        if (j == (currentPhrase.length + 5)) {
            isDeleting = true;
        }

        if (isDeleting) {
            j--;
        } else {
            j++;
        }

        if (j == -3) {
            isDeleting = false;
            i++;
        }

        setCurrentPhrase(phrases[i].substring(0, j));

    }

    useEffect(() => {
        const interval = setInterval(() => type(), 100);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className={` ${className} text-slate-600 dark:text-blue-200`}>
            <h1 className="w-full"> {phrase} {currentPhrase}<Cursor /> </h1>
        </div>
    )
}