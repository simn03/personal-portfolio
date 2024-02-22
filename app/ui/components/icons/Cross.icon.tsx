export default function Cross({ className, onClick }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 50 50"
            className={className}
            onClick={onClick}
        >
            <path d="M9.156 6.313L6.312 9.155 22.157 25 6.22 40.969 9.03 43.78 25 27.844 40.938 43.78l2.843-2.843L27.844 25 43.687 9.156l-2.843-2.844L25 22.157z"></path>
        </svg>
    )
}