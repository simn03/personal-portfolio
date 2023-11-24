
import Project from './components/home/SectionItem.component.jsx'
import Quote from './components/home/Quote.component.jsx'
import RevealOnScroll from './components/home/RevealOnScroll.component.jsx'
import ScrollButton from './components/home/ScrollButton.component.jsx'
import TypeEffect from './components/home/TypeEffect.component.jsx'
import Section from './components/home/Section.component.jsx'


import CaretDown from './components/icons/CaretDownDouble.icon.jsx'

import budgetApp from '../public/images/projects/budget-app.png'
import focusMedia from '../public/images/projects/focus-media.png'
import pulsarStar from '../public/images/projects/pulsar-star.png'
import foodInventory from '../public/images/projects/food-inventory.png'
import dressPortfolio from '../public/images/projects/dress-portfolio.png'
import ubcDatasetExplorer from '../public/images/projects/ubc-campus-explorer.png'
import mediahub from '../public/images/projects/mediahub.png'

export const metadata = {
    title: 'Simrit Nijjar'
}

export default function Page() {

    return (

        <div className='flex flex-col gap-10 m-auto dark:text-blue-200 text-slate-600'>

            <div className={`w-full flex flex-col absolute top-0 left-0 h-screen document-padding`}>

                <RevealOnScroll className="max-sm:pt-10 flex m-auto flex-col lg:flex-row gap-10 lg:gap-16 text-3xl place-items-center ">

                    <TypeEffect
                        className='flex flex-col text-center'
                        phrase={`Sim is a student`}
                        phrases={["majoring in Computer Science at UBC", "minoring in Data Science at UBC", ""]} />


                </RevealOnScroll>

                <ScrollButton
                    className='flex flex-col mx-auto max-sm:basis-1/4 text-teal-600 dark:text-teal-300 text-sm text-center underline underline-offset-4 hover:underline-offset-8 transition-all'
                    elementID={'projects'}>
                    Scroll to Projects

                    <CaretDown className={`animate-bounce flex mx-auto mt-3 opacity-75 animate-ease-linear`} innerClassName={`stroke-teal-600 dark:stroke-teal-300`} />

                </ScrollButton>

            </div>

            <div className='h-screen'></div>

            <RevealOnScroll>

                <Section
                    className={`flex flex-col gap-10 mt-screen`}
                    id={'projects'}
                    header={`Projects`}
                    items={[
                        {
                            className: 'md:col-span-2',
                            image: mediahub, // Replace with the actual image variable
                            title: 'MediaHub (WIP)',
                            metadata: ['MySQL', 'TypeScript', 'React', 'Express.js', 'Tailwind CSS'],
                            url: 'https://mediahub-platform.netlify.app', // Replace with the actual URL
                            page: '/projects/mediahub',
                            description: [
                                'Developed a dynamic online platform to streamline content from various streaming services, enabling users to create personalized watchlists and manage their media library efficiently.',
                                'Enabled seamless creation, editing, and deletion of media entries tailored to individual user preferences.',
                                'Ensured data integrity by normalizing the database to the Third Normal Form (3NF).',
                                'Self-hosted the MySQL database for enhanced control and performance.',
                                'Implemented TypeScript, React, and Tailwind CSS for the frontend.',
                                'Connected the SQL database to the frontend via a robust API created with Express.js and Node.'
                            ],
                        },
                        {
                            className: 'md:col-span-2',
                            image: ubcDatasetExplorer, // Replace with the actual image variable
                            title: 'UBC Dataset Explorer (WIP)',
                            metadata: ['TypeScript', 'React', 'Express.js', 'Tailwind CSS'],
                            url: 'https://ubc-dataset-explorer.netlify.app', // Replace with the actual URL
                            page: '/projects/ubc-dataset-explorer',
                            description: [
                                'Developed a single-page website for querying a comprehensive UBC dataset encompassing campus information, including courses, sections, and building details.',
                                'Employed TypeScript to build querying logic. Utilized Express.js to create a server hosting the API.',
                                'Backend Logic includes Parsing Data, Validating Data, Parsing Query, Validating Query, Collecting Query, Aggregating Query Results, Sorting Query Results.',
                                'Adopted Test Driven Development (TDD) throughout the project to ensure rigorous testing and quality assurance at every stage.'
                            ],
                        },
                        {
                            className: 'md:col-span-2',
                            image: focusMedia,
                            title: 'Focus Media',
                            metadata: ['JavaScript', 'React', 'Tailwind CSS', 'Vite', 'AdobeXD'],
                            url: 'https://focusmedia.netlify.app',
                            page: '/projects/focus-media',
                            description: [
                                'Designed and prototyped using AdobeXD.',
                                'Created using React and Tailwind CSS.',
                                'Packaged and built using Vite. Deployed on Netlify.',
                                'Currently using project to learn the MERN stack.'
                            ],
                        },
                        {
                            className: 'md:row-span-2',
                            image: foodInventory,
                            title: 'Food Inventory App',
                            metadata: ['Java', `Android Studio`, 'XML'],
                            url: 'https://github.com/simrit-nijjar/food-inventory-app',
                            page: '/projects/food-inventory',
                            description: [
                                "Created an inventory application for both pantry and refrigerated foods to track expiration dates of perishable items and promote less food wastage.",
                                "Allows creation and editing of new food items using an XML frontend along with handling and storage of data using Java.",
                                "Designed and implemented in Java using Android Studio."
                            ],
                        },
                        {
                            image: budgetApp,
                            title: 'Budget App',
                            metadata: ['Java', 'JUnit', 'Swing', 'JSON'],
                            url: 'https://github.com/simrit-nijjar/Budget_App',
                            page: '/projects/budget-app',
                            description: [
                                'Allows creation of expenses and incomes, along with sorting via categories.Able to create goals for different categories to stay within your desired budget.',
                                'Used JUnit for full code- coverage testing in multiple contexts, including a save & load function stored in JSON.',
                                'Originally created as a command line app; later changed to a visual UI using the Java Swing Library with multiple frames /pages and easy access to move forward and back between them.',
                                'Designed and implemented in Java using IntelliJ.',
                            ],
                        },
                        {
                            image: pulsarStar,
                            title: 'Pulsar Star Classification',
                            metadata: ['R', 'Jupyter Notebook'],
                            url: 'https://github.com/simrit-nijjar/Pulsar-Star-Classification',
                            page: '/projects/pulsar-star',
                            description: [
                                "Analyzed Pulsar Stars from available data to train a classification model to distinguish pulsar and non - pulsar stars.",
                                "Handled scheduling of 2 other team members with efficient collaboration and delegation of work. Completed within a single week.",
                                "Designed and implemented in R using Jupyter Notebook"
                            ],
                        },
                        {
                            className: 'md:col-span-2',
                            image: dressPortfolio,
                            title: 'Dress Portfolio Site',
                            metadata: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'],
                            url: 'https://github.com/simrit-nijjar/Dress-Design-Portfolio',
                            page: '/projects/dress-portfolio',
                            description: [
                                "Created an online portfolio to display custom clothing designs.",
                                "Used Bootstrap to create dynamic UI elements, such as slideshows, transitioning text, unique overlay context windows for individual products.",
                                "Designed to resize UI elements depending on the viewport dimensions using Bootstrap; implements a dynamic navigation pane to collapse for smaller displays."
                            ],
                        },
                    ]}
                />

            </RevealOnScroll>

            <RevealOnScroll>

                <Section
                    className={`flex flex-col gap-10 mt-screen`}
                    id={`courses`}
                    header={`Courses`}
                    items={[
                        {
                            title: "Computation, Programs, and Programming",
                            metadata: ["CPSC 110", "UBC", "2021", "A+"],
                            description: [
                                "Fundamental program and computation structures.",
                                "Introductory programming skills.",
                                "Computation as a tool for information processing, simulation and modelling, and interacting with the world.",
                            ]
                        },
                        {
                            title: "Models of Computation",
                            metadata: ["CPSC 121", "UBC", "2022", "B+"],
                            description: [
                                "Physical and mathematical structures of computation.",
                                "Boolean algebra and combinations logic circuits; proof techniques; functions and sequential circuits; sets and relations; finite state machines; sequential instruction execution.",
                            ]
                        },
                        {
                            title: "Software Construction",
                            metadata: ["CPSC 210", "UBC", "2022", "A+"],
                            description: [
                                "Design, development, and analysis of robust software components.",
                                "Topics such as software design, computational models, data structures, debugging, and testing.",
                            ]
                        },
                        {
                            title: "Introduction to Computer Systems",
                            metadata: ["CPSC 213", "UBC", "2022", "A+"],
                            description: [
                                "Software architecture, operating systems, and I/O architectures.",
                                "Relationships between application software, operating systems, and computing hardware; critical sections, deadlock avoidance, and performance; principles and operation of disks and networks.",
                            ]
                        },
                        {
                            title: "Basic Algorithms and Data Structures",
                            metadata: ["CPSC 221", "UBC", "2023", "A+"],
                            description: [
                                "Design and analysis of basic algorithms and data structures; algorithm analysis methods, searching and sorting algorithms, basic data structures, graphs and concurrency.",
                            ]
                        },
                    ]}
                />

                <h1 className='text-center pt-5 opacity-70 text-sm'> All course names & descriptions are originally from <a target='_blank' href='https://courses.students.ubc.ca'> courses.students.ubc.ca</a>  as of 2023/09/20 </h1>

            </RevealOnScroll>


        </ div >

    );

}
