"use client";

import { useEffect, useState } from "react";
import HoverBG from "@/app/ui/components/home/HoverBG.component";
import { MousePosition } from "@/app/lib/Definitions";

/**
 * Global ambient effects: a soft ripple that follows the cursor and a short
 * pulse on click. Kept out of the root layout so layout stays presentational.
 */
export default function Ambient() {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    const handleMouseClick = () => {
      setIsVisible(true);
      window.setTimeout(() => setIsVisible(false), 500);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleMouseClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleMouseClick);
    };
  }, []);

  return <HoverBG x={mousePos.x} y={mousePos.y} isVisible={isVisible} />;
}
