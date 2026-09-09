"use client";

import { useEffect, useRef, useState } from "react";
import Cursor from "./Cursor.component";

type TypeEffectProps = {
  className?: string;
  phrase: string;
  phrases: string[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
};

export default function TypeEffect({ className, phrase, phrases, as: Tag = "h1" }: TypeEffectProps) {
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0] ?? "");
  const phraseIndex = useRef(0);
  const characterIndex = useRef(phrases[0]?.length ?? 0);
  const isDeleting = useRef(false);

  useEffect(() => {
    if (phrases.length === 0) {
      setCurrentPhrase("");
      return;
    }

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
    <Tag className={`${className ?? ""} text-foreground`}>
      <span>
        {phrase} {currentPhrase}
        <Cursor />
      </span>
    </Tag>
  );
}
