

export default function Quote({ text1, linkedText, text2, link, date }) {
    return (
        <div>
            <p>
                {text1} <a
                    target="_blank"
                    href={link}
                    className="text-secondary">{linkedText}</a> {text2}
            </p>

            <p className="text-xl text-right">
                &mdash; {date}
            </p>
        </div>
    )
}