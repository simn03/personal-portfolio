
import Project from './components/home/Project.component.jsx'
import Quote from './components/home/Quote.component.jsx'

import budgetApp from '../public/images/projects/budget-app.png'
import focusMedia from '../public/images/projects/focus-media.png'
import pulsarStar from '../public/images/projects/pulsar-star.png'
import foodInventory from '../public/images/projects/food-inventory.png'
import dressPortfolio from '../public/images/projects/dress-portfolio.png'

export const metadata = {
    title: 'Simrit Nijjar'
}

export default function Page() {

    return (

        <div className='flex flex-col gap-10'>

            <section className="flex flex-col lg:flex-row gap-10 lg:gap-16 font-serif text-3xl text-primary h-screen">

                <Quote
                    text1={`Sim is a student studying `}
                    linkedText={`Computer Science`}
                    text2={` at UBC.`}
                    link={`https://you.ubc.ca/ubc_programs/computer-science-vancouver-bsc/`}
                    date={`Sep 7, 2021`} />

                <Quote
                    text1={`Sim is also pursuing a `}
                    linkedText={`Data Science minor`}
                    text2={` at UBC.`}
                    link={`https://datascience.ubc.ca/minor`}
                    date={`May 30, 2023`} />

            </section>

            <section className='flex flex-col gap-10 js-show-on-scroll'>

                <h1 className='text-2xl uppercase text-black dark:text-blue-100'> Projects <hr /> </h1>


                <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>

                    <div className="lg:col-span-2">
                        <Project
                            image={focusMedia}
                            title="Focus Media"
                            description="JavaScript, React, Tailwind CSS, Vite, AdobeXD"
                            url='https://focusmedia.netlify.app'
                            page={`/projects/focus-media`} />
                    </div>


                    <div className="lg:row-span-2">
                        <Project
                            image={foodInventory}
                            title="Food Inventory App"
                            description="Java, Android Studio, XML"
                            url='https://github.com/simrit-nijjar/food-inventory-app'
                            page={`/projects/food-inventory`} />
                    </div>

                    <Project
                        image={budgetApp}
                        title={"Budget App"}
                        description={"Java, JUnit, Swing, JSON"}
                        url={'https://github.com/simrit-nijjar/Budget_App'}
                        page={`/projects/budget-app`} />

                    <Project
                        image={pulsarStar}
                        title="Pulsar Star Classification"
                        description="R, Jupyter Notebook"
                        url='https://github.com/simrit-nijjar/Pulsar-Star-Classification'
                        page={`/projects/pulsar-star`} />

                    <div className="lg:col-span-2">
                        <Project
                            image={dressPortfolio}
                            title="Dress Portfolio Site"
                            description="HTML, CSS, Bootstrap, JavaScript"
                            url='https://github.com/simrit-nijjar/Dress-Design-Portfolio'
                            page={`/projects/dress-portfolio`} />
                    </div>

                </div>

            </section>

        </ div>

    );

}
