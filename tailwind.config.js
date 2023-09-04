/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
            },
            colors: {
                'primary': '#3e2e40',
                'secondary': '#534B52',
                'accent': '#474448',
                'background': '#F1F0EA',
                'secondary-bg': '#E0DDCF',

                'dark-primary': '#3e2e40',
                'dark-econdary': '#534B52',
                'dark-accent': '#474448',
                'dark-background': '#F1F0EA',
                'dark-secondary-bg': '#E0DDCF',
            },
            animation: {
                'blink': 'blink 1s linear infinite',
                'fadeIn': "fadeIn 2s ease-in forwards",
                'ripple': 'ripple 0.5s ease-in forwards',
            },
            keyframes: {
                blink: {
                    '0%, 100%': { opacity: '0' },
                    '50%': { opacity: '1' },
                },
                fadeIn: {
                    "0%": {
                        opacity: 0,
                        screenX: 5
                    },
                    "100%": {
                        opacity: 1,
                        screenX: 0
                    }
                },
                ripple: {
                    "0": {
                        transform: "scale(0)",
                        opacity: 100
                    },
                    "100%": {
                        transform: "scale(100)",
                        opacity: 0
                    }
                },
            },
            fontFamily: {
                sans: ['var(--font-NeueMachina)'],
                serif: ['var(--font-Writer)'],
            },
        }
    },
    plugins: [
        require('tailwindcss-animated')
    ],
}