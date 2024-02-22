import Section from "../components/home/Section.component";
import mediahub from "../../../public/images/projects/mediahub.png";
import ubcDatasetExplorer from "../../../public/images/projects/ubc-campus-explorer.png";
import focusMedia from "../../../public/images/projects/focus-media.png";
import foodInventory from "../../../public/images/projects/food-inventory.png";
import budgetApp from "../../../public/images/projects/budget-app.png";
import pulsarStar from "../../../public/images/projects/pulsar-star.png";
import dressPortfolio from "../../../public/images/projects/dress-portfolio.png";
import RevealOnScroll from "../components/home/RevealOnScroll.component";

export default function ProjectsPage() {
    return (
        <>
            <RevealOnScroll>

                <Section
                    className={`flex flex-col gap-10 mt-screen`}
                    id={'projects'}
                    header={`Projects`}
                    items={[
                        {
                            className: 'md:col-span-2',
                            image: `/images/projects/mediahub.png`,
                            title: 'MediaHub (WIP)',
                            metadata: ['MySQL', 'TypeScript', 'React', 'Express.js', 'Tailwind CSS'],
                            url: '', // Replace with the actual URL
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
                            image: '/images/projects/ubc-campus-explorer.png',
                            title: 'UBC Dataset Explorer (WIP)',
                            metadata: ['TypeScript', 'React', 'Express.js', 'Tailwind CSS'],
                            url: 'https://www.youtube.com/watch?v=un5eN5aV-BU', // Replace with the actual URL
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
                            image: '/images/projects/focus-media.png',
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
                            image: '/images/projects/food-inventory.png',
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
                            image: '/images/projects/budget-app.png',
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
                            image: '/images/projects/pulsar-star.png',
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
                            image: '/images/projects/dress-portfolio.png',
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
        </>
    )
}