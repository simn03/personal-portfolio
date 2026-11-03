"use client"

import React from 'react';

import { useRouter } from 'next/navigation';

type ScrollButtonProps = {
    className?: string,
    onClick?: () => void,
    elementID?: string,
    children: React.ReactNode
}

/** Pending "remove the landing highlight" timers, keyed by the highlighted element. */
const highlightTimers = new WeakMap<HTMLElement, number>();

export default function ScrollButton({ className, onClick, elementID, children }: ScrollButtonProps) {

    const router = useRouter();

    const scrollToSection = () => {

        onClick?.();

        if (typeof document === 'undefined') {
            return;
        }

        // Brand link: return to the homepage, or scroll to the top when there.
        if (!elementID) {
            if (window.location.pathname !== '/') {
                router.push('/');
                return;
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Same-page anchor: animate ourselves (next/router only updates the URL
        // without scrolling when the route is unchanged). `scroll-mt-*` on the
        // target keeps it clear of the sticky nav.
        const target = document.getElementById(elementID);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.history.replaceState(null, '', `#${elementID}`);
            // replaceState doesn't trigger `:target`, so flag the destination
            // ourselves; `.retro-target` cards pulse briefly to show where you landed.
            // One timer per target: a repeat click restarts the pulse instead of
            // having the earlier timer cut the new one short.
            window.clearTimeout(highlightTimers.get(target));
            target.classList.remove('is-targeted');
            void target.offsetWidth; // restart the animation on repeat clicks
            target.classList.add('is-targeted');
            highlightTimers.set(
                target,
                window.setTimeout(() => {
                    target.classList.remove('is-targeted');
                    highlightTimers.delete(target);
                }, 1800)
            );
            return;
        }

        // Section lives on another route (e.g. clicking a nav link from /about).
        router.push(`/#${elementID}`);
    };

    return (
        <button type="button" onClick={scrollToSection} className={className}>{children}</button>
    );
}
