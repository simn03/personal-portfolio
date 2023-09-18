
import Project from './components/home/Project.component.jsx'
import Quote from './components/home/Quote.component.jsx'
import RevealOnScroll from './components/home/RevealOnScroll.component.jsx'
import ScrollButton from './components/home/ScrollButton.component.jsx'
import TypeEffect from './components/home/TypeEffect.component.jsx'
import Section from './components/home/Section.component.jsx'


import CaretDown from './components/icons/CaretDown.icon.jsx'

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

            <div className='w-full flex flex-col absolute top-0 left-0 h-screen document-padding'>

                <RevealOnScroll className="max-sm:pt-10 flex m-auto flex-col lg:flex-row gap-10 lg:gap-16 text-3xl place-items-center ">

                    <TypeEffect
                        className='flex flex-col text-center lg:text-left'
                        phrase={`Sim is a student`}
                        phrases={["majoring in Computer Science at UBC", "minoring in Data Science at UBC", ""]} />


                </RevealOnScroll>

                <ScrollButton
                    className='flex flex-col mx-0 max-sm:basis-1/3 z-10 opacity-75 text-slate-600 dark:text-blue-100 text-sm text-center underline underline-offset-4 hover:underline-offset-8 transition-all'
                    elementID={'projects'}>
                    Scroll to Projects

                    <CaretDown className={`${"animate-bounce"} flex mx-auto mt-3 opacity-75 animate-ease-linear`} innerClassName={`stroke-slate-600 dark:stroke-blue-100 `} />

                </ScrollButton>

            </div>

            <div className='h-screen'></div>

            <RevealOnScroll>

                <Section className={`flex flex-col gap-10 mt-screen`} header={`Projects`}>
                    <Project
                        className={'lg:col-span-2'}
                        image={focusMedia}
                        title="Focus Media"
                        description={["JavaScript", "React", "Tailwind CSS", "Vite", "AdobeXD"]}
                        url='https://focusmedia.netlify.app'
                        page={`/projects/focus-media`} />


                    <Project
                        className="lg:row-span-2"
                        image={foodInventory}
                        title="Food Inventory App"
                        description={["Java", "Android Studio", "XML"]}
                        url='https://github.com/simrit-nijjar/food-inventory-app'
                        page={`/projects/food-inventory`} />

                    <Project
                        image={budgetApp}
                        title={"Budget App"}
                        description={["Java", "JUnit", "Swing", "JSON"]}
                        url={'https://github.com/simrit-nijjar/Budget_App'}
                        page={`/projects/budget-app`} />

                    <Project
                        image={pulsarStar}
                        title="Pulsar Star Classification"
                        description={["R", "Jupyter Notebook"]}
                        url='https://github.com/simrit-nijjar/Pulsar-Star-Classification'
                        page={`/projects/pulsar-star`} />

                    <Project
                        className="lg:col-span-2 "
                        image={dressPortfolio}
                        title={"Dress Portfolio Site"}
                        description={["HTML", "CSS", "Bootstrap", "JavaScript"]}
                        url='https://github.com/simrit-nijjar/Dress-Design-Portfolio'
                        page={`/projects/dress-portfolio`} />
                </Section>

            </RevealOnScroll>


        </ div >

    );

}
