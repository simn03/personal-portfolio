"use client"

import { useEffect, useRef, useState } from "react";
import Cursor from "./Cursor.component";

type TypeEffectProps = {
    className?: string,
    phrase: string,
    phrases: Array<string>,
}

export default function TypeEffect({ className, phrase, phrases }: TypeEffectProps) {
    const [currentPhrase, setCurrentPhrase] = useState(phrases[0] ?? "");
    const phraseIndex = useRef(0);
    const characterIndex = useRef(phrases[0]?.length ?? 0);
    const isDeleting = useRef(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const activePhrase = phrases[phraseIndex.current] ?? "";

            if (characterIndex.current >= activePhrase.length + 5) {
                isDeleting.current = true;
            }

            characterIndex.current += isDeleting.current ? -1 : 1;

            if (characterIndex.current <= -3) {
                isDeleting.current = false;
                phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
            }

            setCurrentPhrase(activePhrase.substring(0, characterIndex.current));
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [phrases]);

    return (
        <div className={` ${className} text-slate-600 dark:text-blue-200`}>
            <h1 className="w-full"> {phrase} {currentPhrase}<Cursor /> </h1>
        </div>
    )
}
