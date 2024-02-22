type ToggleProps = {
    className?: string,
    darkMode: boolean,
    setDarkMode: Function

}

export default function Toggle({ className, darkMode, setDarkMode }: ToggleProps) {

    function handleClick() {
        setDarkMode(!darkMode);
        localStorage.setItem("darkMode", String(!darkMode));
        // console.log(localStorage.getItem("darkMode"));

    }

    return (
        <button
            onClick={handleClick}
            className={`h-full w-16 outline rounded-2xl p-1 dark:bg-slate-600 transition-all duration-500 ${darkMode ? 'bg-opacity-0' : ''} ` + className}>
            <div className={`h-6 w-6 rounded-full bg-yellow-500 dark:bg-blue-500 transition-all duration-500 ${darkMode ? 'translate-x-8' : ''}`}></div>

        </button>
    )
}