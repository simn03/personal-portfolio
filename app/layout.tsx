
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import "./global.css";
import NavBar from "./ui/components/navigation/NavBar.component";
import Footer from "./ui/components/navigation/Footer.component";

import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import ThemeBootScript from "@/lib/theme/ThemeBootScript";
import Ambient from "@/components/ambient-effects";

import localFont from 'next/font/local'

const NeueMachina = localFont({
    src: [
        {
            path: '../public/fonts/PPNeueMachina/PlainLight.woff2',
            weight: '300',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPNeueMachina/PlainLightItalic.woff2',
            weight: '300',
            style: 'italic'
        },
        {
            path: '../public/fonts/PPNeueMachina/PlainRegular.woff2',
            weight: '375',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPNeueMachina/PlainRegularItalic.woff2',
            weight: '375',
            style: 'italic'
        },
        {
            path: '../public/fonts/PPNeueMachina/PlainUltrabold.woff2',
            weight: '800',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPNeueMachina/PlainUltraboldItalic.woff2',
            weight: '800',
            style: 'italic'
        }
    ],
    variable: '--font-NeueMachina'
})

const Writer = localFont({
    src: [
        {
            path: '../public/fonts/PPWriter/BlackItalic.otf',
            weight: '900',
            style: 'italic'
        },
        {
            path: '../public/fonts/PPWriter/Bold.otf',
            weight: '700',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPWriter/BoldItalic.otf',
            weight: '700',
            style: 'italic'
        },
        {
            path: '../public/fonts/PPWriter/Book.otf',
            weight: '340',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPWriter/Regular.otf',
            weight: '400',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPWriter/Thin.otf',
            weight: '100',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPWriter/Ultrabold.otf',
            weight: '800',
            style: 'normal'
        },
        {
            path: '../public/fonts/PPWriter/UltraboldItalic.otf',
            weight: '800',
            style: 'italic'
        }
    ],
    variable: '--font-Writer'
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
    // suppressHydrationWarning: the theme boot script sets data-theme / toggles
    // .dark on <html> before hydration, so React must not diff attributes on the
    // element it doesn't own (otherwise it strips the applied theme and warns).
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${NeueMachina.variable} ${Writer.variable} h-screen overflow-y-scroll`}
        >
            <body className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <ThemeBootScript />
                <Analytics />
                <SpeedInsights />

                <ThemeProvider>
                    <NavBar />
                    <Ambient />
                    <main className="overflow-x-hidden">{children}</main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
