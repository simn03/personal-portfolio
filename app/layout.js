import "./global.css"
import NavBar from "./components/navigation/NavBar.component.jsx"

export default function RootLayout({ children }) {
    return (

        <html lang="en">
            <body className="bg-gradient-to-t from-background to-white">
                <NavBar />

                <div className="p-10 sm:px-20 md:px-40 lg:px-60">
                    {children}
                </div>

            </body>
        </html>
    )
}