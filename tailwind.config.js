/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
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
            },
            keyframes: {
                blink: {
                    '0%, 100%': { opacity: '0' },
                    '50%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}