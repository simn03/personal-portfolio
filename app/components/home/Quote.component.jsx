

export default function Quote({ text1, linkedText, text2, link, date }) {
    return (
        <div className="animate-fadeIn dark:text-blue-100 leading-10 font-thin">
            <p>
                {text1} <a
                    target="_blank"
                    href={link}
                    className=" text-purple-600 dark:text-blue-300 underline underline-offset-8">{linkedText}</a> {text2}
            </p>

            <p className="text-xl text-right">
                &mdash; {date}
            </p>
        </div>
    )
}