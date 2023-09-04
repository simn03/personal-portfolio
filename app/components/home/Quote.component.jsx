

export default function Quote({ className, text1, linkedText, text2, link, date }) {
    return (
        <div className={`dark:text-blue-100 leading-10 font-thin ` + className}>
            <p>
                {text1} <a
                    target="_blank"
                    href={link}
                    className=" text-purple-600 dark:text-blue-300 underline underline-offset-8 hover:line-through transition-all ">{linkedText}</a> {text2}
            </p>

            <p className="text-xl text-right">
                &mdash; {date}
            </p>
        </div>
    )
}