

export default function Quote({ text1, linkedText, text2, link, date }) {
    return (
        <div className="animate-fadeIn">
            <p>
                {text1} <a
                    target="_blank"
                    href={link}
                    className=" text-purple-600 underline underline-offset-8">{linkedText}</a> {text2}
            </p>

            <p className="text-xl text-right">
                &mdash; {date}
            </p>
        </div>
    )
}