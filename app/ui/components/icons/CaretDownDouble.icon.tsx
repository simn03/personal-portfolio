import React from "react";

export default function CaretDownDouble({ className, innerClassName }) {
    return (
        <svg
            className={`${className}`}
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            fill="none"
            viewBox="0 0 25 25"
        >
            <path
                className={`${innerClassName} `}
                strokeWidth="0.5"
                d="M17 8.5L12.5 13 8 8.5m9 4L12.5 17 8 12.5"
            ></path>
        </svg>
    );
}

