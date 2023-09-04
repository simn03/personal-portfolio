import { useState } from "react";

export default function HoverBG({ className, isVisible, x, y }) {


    const radius = 10;

    const style = {
        left: x - (radius / 2),
        top: y - (radius / 2),
        width: radius,
        height: radius,
    }

    return (
        <div
            className={
                `${isVisible ? "opacity-20 animate-ripple" : "opacity-0"} -z-10 rounded-full bg-gradient-radial to-transparent dark:from-slate-700 from-blue-300 fixed overflow-hidden`}
            style={style}>
        </div>)
}