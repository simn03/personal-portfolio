import BlackLetterhead from '../../public/images/coop-letterhead-black.png';
import WhiteLetterhead from '../../public/images/coop-letterhead-white.png';
import Image from 'next/image';

export const metadata = {
    title: 'Resume'
}

let heading = 'font-bold uppercase print:mt-4';
let section = 'flex flex-col gap-4';

function Divider() {
    return (
        <div class="inset-x-0 bottom-0 h-[0.1em] bg-gray-500"></div>
    )
}

function Item({ title, subtitle, date, description, extra }) {

    function DescriptionItem({ text }) {
        return (
            <li className='list-disc list-inside'>
                {text}
            </li>
        )
    }

    return (
        <div>
            <div className='flex flex-col md:flex-row print:flex-row'>
                <p className='flex-grow'> <b>{title}</b> | {subtitle} </p>    {/* Project Title | Project Subtitle */}
                <p> {date} </p>
            </div>

            {description ? <ul className='list-inside'> {description.map((text) => <DescriptionItem text={text} />)} </ul> : null}

            {extra ? <p> <b>Technologies: </b>{extra}</p> : null}

        </div>
    )
}


export default function Page() {
    return (
        <div className={`flex flex-col gap-10 text-slate-600 dark:text-blue-100 md:bg-glass print:text-sm print:gap-0`}>

            <Image src={BlackLetterhead} alt="UBC Science Co-op Letterhead" className='md:w-[60%] place-self-end block dark:hidden print:block' />
            <Image src={WhiteLetterhead} alt="UBC Science Co-op Letterhead" className='md:w-[60%] place-self-end hidden dark:block print:hidden' />

            <section className={'flex flex-col md:flex-row gap-4 print:flex-row print:mt-4'}>

                <div className='flex flex-col flex-grow'>
                    <p>Majoring in Computer Science</p>
                    <p>Minoring in Data Science</p>
                    <p>3rd Year UBC Student</p>
                </div>

                <div className='flex flex-col md:place-self-end'>
                    <a href='https://github.com/simrit-nijjar' target='_blank'> https://github.com/simrit-nijjar </a>
                    <a href="mailto:personal@simrit.dev" target='_blank'> personal@simrit.dev </a>
                    <a href="https://portfolio.simrit.dev" target='_blank'> portfolio.simrit.dev </a>
                </div>

            </section>




            <section className={section}>

                <h1 className={heading}> Technical Skills <Divider /></h1>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-0 print:grid-cols-3 print:gap-0'>
                    <h2 className='font-semibold'>Programming Language: </h2>
                    <p className=' col-span-2'> C, C++, Java, JavaScript, Typescript, R, Racket </p>

                    <h2 className='font-semibold'>Frontend Development: </h2>
                    <p className=' col-span-2'>React, Next JS, HTML, Tailwind CSS, Bootstrap</p>

                    <h2 className='font-semibold'>Backend Development: </h2>
                    <p className=' col-span-2'>MySQL, Oracle, Express.js, Node</p>

                    <h2 className='font-semibold'>Services: </h2>
                    <p className=' col-span-2'>Vercel, Netlify, Cloudflare</p>
                </div>

            </section>

            <section className='flex flex-col gap-4'>

                <h1 className={heading}> Projects <Divider /> </h1>



                <Item
                    title={`UBC Dataset Explorer`}
                    subtitle={`Software Engineering (WIP)`}
                    date={`Sep 2023 - Jan 2024`}
                    description={[
                        "Developed a single-page website for querying a comprehensive UBC dataset encompassing campus information, including courses, sections, and building details.",
                        "Employed TypeScript to build querying logic. Utilized Express.js to create a server hosting the API.",
                        "Backend Logic includes Parsing Data, Validating Data, Parsing Query, Validating Query, Collecting Query, Aggregating Query Results, Sorting Query Results.",
                        "Adopted Test Driven Development (TDD) throughout the project to ensure rigorous testing and quality assurance at every stage."
                    ]}
                    extra={`TypeScript, React, Express.js, Tailwind CSS`}
                />

                <Item
                    title={`MediaHub`}
                    subtitle={`Relational Databases (WIP)`}
                    date={`Sep 2023 - Jan 2024`}
                    description={[
                        "Develop a dynamic online platform to streamline content from various streaming services, enabling users to create personalized watchlists and manage their media library efficiently.",
                        "Seamless creation, editing, and deletion of media entries tailored to individual user preferences.",
                        "Ensured data integrity by normalizing the database to the Third Normal Form (3NF).",
                        "Self-hosted the MySQL database for enhanced control and performance.",
                        "Implemented TypeScript, React, and Tailwind CSS for the frontend.",
                        "Connected the SQL database to the frontend via a robust API created with Express.js and Node."]}
                    extra={`MySQL, TypeScript, React, Express.js, Tailwind CSS`}
                />

                <Item
                    title={`Focus Media`}
                    subtitle={`Personal Project (WIP)`}
                    date={`June - Present`}
                    description={[
                        "Designed and prototyped using AdobeXD",
                        "Created using React and Tailwind CSS",
                        "Packaged and built using Vite. Deployed on Netlify.",
                        "Currently using project to learn the MERN stack."]}
                    extra={`JavaScript, React, Tailwind CSS, Vite, AdobeXD`}
                />

                <Item
                    title={`Budget App`}
                    subtitle={`Software Construction`}
                    date={`Aug 2022`}
                    description={[
                        "Allows creation of expenses and incomes, along with sorting via categories. Able to create goals for different categories to stay within your desired budget.",
                        "Used JUnit for full code-coverage testing in multiple contexts, including a save & load function stored in JSON.",
                        "Originally created as a command line app; later changed to a visual UI using the Java Swing Library with multiple frames /pages and easy access to move forward and back between them.",
                        "Designed and implemented in Java using IntelliJ."]}
                    extra={`Java, JUnit, Java Swing Library, JSON`}
                />

                <Item
                    title={`Pulsar Star Classification`}
                    subtitle={`Data Science`}
                    date={`Apr 2022`}
                    description={[
                        "Analyzed Pulsar Stars from available data to train a classification model to distinguish pulsar and non - pulsar stars.",
                        "Handled scheduling of 2 other team members with efficient collaboration and delegation of work. Completed within a single week.",
                        "Designed and implemented in R using Jupyter Notebook"
                    ]}
                    extra={`R, Jupyter Notebook`} />

                <Item
                    title={`Food Inventory App`}
                    subtitle={`Game of App `}
                    date={`Feb 2020`}
                    description={[
                        "Created an inventory application for both pantry and refrigerated foods to track expiration dates of perishable items and promote less food wastage.",
                        "Allows creation and editing of new food items using an XML frontend along with handling and storage of data using Java.",
                        "Designed and implemented in Java using Android Studio."
                    ]}
                    extra={`Java, XML, Android Studio`} />

                <Item
                    title={`Dress Design Porfolio`}
                    subtitle={`Personal Project`}
                    date={`Feb 2020`}
                    description={[
                        "Created an online portfolio to display custom clothing designs.",
                        "Used Bootstrap to create dynamic UI elements, such as slideshows, transitioning text, unique overlay context windows for individual products.",
                        "Designed to resize UI elements depending on the viewport dimensions using Bootstrap; implements a dynamic navigation pane to collapse for smaller displays."
                    ]}
                    extra={`HTML, CSS, Bootstrap, JavaScript`} />

            </section>

            <section className={section}>

                <h1 className={heading}> Work Experience <Divider /> </h1>

                <Item
                    title={`Catering Service Attendant`}
                    subtitle={`BC Ferries`}
                    date={`May 2023 - Present`}
                    description={[
                        "Tasked with washing dishes, preparing food, stocking inventory, serving food, bussing cafeteria, janitorial services in both staff and passenger areas, and other catering - related work.",
                        "Fully certified to handle passenger management, such as sweeping and clearing lounges of passengers while leading to a safe environment in case of an emergency.",
                        "Certified to handle marine emergencies, such as deploying evacuation rafts and preparing for offloading of passengers in case of Abandon Ship."
                    ]}
                />

                <Item
                    title={`Key Holder & Sales Associate`}
                    subtitle={`Lindt & Sprungli`}
                    date={`Dec 2020 - Mar 2022`}
                    description={[
                        "Handled daily data entry and serviced around 30-40 customers per day during the peak of COVID-19.",
                        "Took care of all customers using knowledge of the product inventory to curate personalized suggestions.",
                        "Achieved 100% on the company consumer satisfaction score."
                    ]}
                />

                <Item
                    title={`Administrative Assistant`}
                    subtitle={`Virk Insurance`}
                    date={`Feb 2021 - Aug 2021`}
                    description={[
                        "Provided aid in common office and insurance tasks such as Renewals, Data Entry, Filing, etc.",
                        "Manually filed and digitalized 3 years’ worth of client information and successfully migrated theoffice to a new insurance system(SigXP)."
                    ]}
                />

            </section>

            <section className={`flex flex-col gap-4 print:gap-0`}>

                <h1 className={`${heading} mb-4`}> Certifications <Divider /> </h1>

                <Item
                    title={`Food Handler Certification`}
                    subtitle={`BC Food Safe`}
                    date={`May 2023`}
                />

                <Item
                    title={`Serving It Right Certification`}
                    subtitle={`Responsible Servide BC`}
                    date={`May 2023`}
                />

                <Item
                    title={`LSA, Marine Evacuation Systems`}
                    subtitle={`BC Ferries`}
                    date={`May 2023`}
                />

                <Item
                    title={`Marine Medical License`}
                    subtitle={`Transport Canada`}
                    date={`May 2023`}
                />

                <Item
                    title={`Passenger Safety Management Certificate`}
                    subtitle={`Transport Canada`}
                    date={`May 2023`}
                />

            </section>

            <section className={section}>

                <h1 className={heading}> Education <Divider /> </h1>

                <Item
                    title={`Bachelor of Science - Majoring in Computer Science`}
                    subtitle={`University of British Columbia`}
                    date={`Sep 2021 - Present`}
                />

            </section>

        </div >
    )
}