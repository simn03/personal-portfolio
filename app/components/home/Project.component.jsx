
import Image from 'next/image'

export default function Project({ image, title, description, url, page }) {
    return (
        <div className='flex flex-col gap-3'>

            <a className="flex m-auto h-full w-full overflow-hidden hover:cursor-pointer" href={page}>

                <Image src={image} className="hover:scale-110 transition-all object-contain rounded-md" />

            </a>

            <div>
                <a className="text-2xl hover:cursor-pointer" href={url} target='_blank'> {title} </a>
                <p className="text-xl opacity-70"> Technologies: {description} </p>
            </div>

        </div>
    )
}