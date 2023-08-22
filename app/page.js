import Project from './components/home/Project.component.js'

import budgetApp from '../public/images/projects/budget-app.png'
import focusMedia from '../public/images/projects/focus-media.png'
import pulsarStar from '../public/images/projects/pulsar-star.png'
import foodInventory from '../public/images/projects/food-inventory.png'
import dressPortfolio from '../public/images/projects/dress-portfolio.png'

export const metadata = {
    title: 'home',
}

function Cursor() {
    return (
        <div className="inline-block h-[1.1em] w-[0.065em] align-text-top bg-secondary animate-blink"></div>
    )
}

export default function Page() {
    return (
        <div className='flex flex-col gap-10'>



            <section className="flex flex-col lg:flex-row gap-10 lg:gap-16 font-serif text-3xl text-primary ">

                <div>
                    <p>
                        Sim is a student studying <a target="_blank" href="https://you.ubc.ca/ubc_programs/computer-science-vancouver-bsc/" className="text-secondary">Computer Science</a> at UBC.
                    </p>

                    <p className="text-xl text-right"> &mdash; Sep 7, 2021 </p>
                </div>

                <div>
                    <p>
                        Sim is also pursuing a <a target="_blank" href="https://datascience.ubc.ca/minor" className="text-secondary">Data Science</a> minor at UBC. <Cursor />
                    </p>

                    <p className="text-xl text-right"> &mdash; May 30, 2023 </p>
                </div>

            </section >

            <section className='flex flex-col gap-10'>

                <h1 className='text-2xl uppercase'> Projects <hr /> </h1>


                <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>

                    <Project image={focusMedia} title="Focus Media" description="JavaScript, React, Tailwind CSS, Vite, AdobeXD" url='https://github.com/simrit-nijjar/focus-media' />

                    <Project image={budgetApp} title="Budget App" description="Java, JUnit, Swing, JSON" url='https://github.com/simrit-nijjar/Budget_App' />

                    <Project image={pulsarStar} title="Pulsar Star Classification" description="R, Jupyter Notebook" url='https://github.com/simrit-nijjar/Pulsar-Star-Classification' />

                    <Project image={foodInventory} title="Food Inventory App" description="Java, Android Studio, XML" url='https://github.com/simrit-nijjar/food-inventory-app' />

                    <Project image={dressPortfolio} title="Dress Portfolio Site" description="HTML, CSS, Bootstrap, JavaScript" url='https://github.com/simrit-nijjar/Dress-Design-Portfolio' />

                </div>

            </section>

        </div>

    );
}