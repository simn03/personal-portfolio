"use client"

export default function Section({ children, className, header }) {
    return (
        <section className={`${className}`}>

            <h1 className='text-2xl uppercase text-black dark:text-blue-100 backdrop-blur-md snap-start'
                id='projects'> {header} <hr /> </h1>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                {children}
            </div>

        </section>
    );
}