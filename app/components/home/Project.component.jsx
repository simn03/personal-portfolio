
import Image from 'next/image'

function Tag({ children }) {
    return (
        <div className='flex text-teal-500 dark:text-teal-300 bg-teal-300 dark:bg-teal-500 bg-opacity-25 dark:bg-opacity-25 rounded-3xl hover:outline'>
            <p className="text-sm px-4 p-1 select-none place-self-center">{children}</p>
        </div>
    )
}

export default function Project({ className, image, title, description, url, page }) {
    return (
        <div className={`z-10 flex flex-col gap-3 bg-glass ` + className}>

            <a className="flex m-auto h-full w-full overflow-hidden hover:cursor-pointer" href={page}>

                <Image
                    src={image}
                    className="hover:scale-110 transition-all object-contain rounded-lg"
                    alt={`image of ${title} project`} />

            </a>

            <div className='dark:text-blue-200 text-slate-600'>
                <a className="text-2xl hover:cursor-pointer" href={url} target='_blank'> {title} </a>
                <div className="mt-4 flex flex-row flex-wrap gap-2">
                    {
                        description.map((tag, index) => {
                            return <Tag key={index}>{tag}</Tag>
                        })
                    }
                </div>
            </div>

        </div>
    )
}