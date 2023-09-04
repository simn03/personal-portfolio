export default function Hamburger({ className, onClick }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 256 256"
            className={className}
            onClick={onClick}
        >
            <path
                strokeMiterlimit="10"
                d="M5 8a2 2 0 100 4h40a2 2 0 100-4zm0 15a2 2 0 100 4h40a2 2 0 100-4zm0 15a2 2 0 100 4h40a2 2 0 100-4z"
                fontFamily="none"
                fontSize="none"
                fontWeight="none"
                textAnchor="none"
                transform="scale(5.12)"
            ></path>
        </svg>
    )
}