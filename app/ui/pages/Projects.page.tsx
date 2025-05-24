import Section from "../components/section/Section.component";
import RevealOnScroll from "../components/home/RevealOnScroll.component";
import { ItemType } from "../../lib/Definitions";

const items: ItemType[] = [
  {
    images: [
      '/projects/leaserflow/dashboard.png',
      '/projects/leaserflow/applications.png',
      '/projects/leaserflow/application-details.png',
      '/projects/leaserflow/application-submission.png',
      '/projects/leaserflow/application-form.png',
      '/projects/leaserflow/attachments.png',
      '/projects/leaserflow/notes.png',
      '/projects/leaserflow/notifications.png',
      '/projects/leaserflow/settings.png',
      '/projects/leaserflow/settings-accounts.png',
      '/projects/leaserflow/settings-accounts-details.png',
      '/projects/leaserflow/settings-accounts-form.png',
      '/projects/leaserflow/settings-roles.png',
      '/projects/leaserflow/settings-roles-details.png',
      '/projects/leaserflow/settings-labels.png',
    ],
    title: 'LeaserFlow',
    metadata: ['MySQL', 'TypeScript', 'Vite', 'React', 'hapi.js', 'Tailwind CSS', 'AWS EC2', 'AWS S3', 'AWS RDS', 'AWS CloudFront', 'AWS SES', 'socket.io'],
    url: 'https://leaserflow.com',
    page: '/projects/leaserflow',
    description: [
      'Full-stack web application for managing equipment leasing and rental processes, including customer management, inventory tracking, and financial reporting.',
      'Role-based access control consisting of granular permissions in a subject-based access control (RBAC) system.',
      'JWT authentication with instant token refresh and revocation on user permission change',
      'Real-time notifications and chat system using socket.io.',
      'Ability to send application directly to lenders via email using AWS SES and S3 for attachments.',
    ],
  },
  {
    images: [
      '/projects/bad-chilli-peppers/start.png',
      '/projects/bad-chilli-peppers/tutorial.png',
      '/projects/bad-chilli-peppers/level-select.png',
      '/projects/bad-chilli-peppers/game-play.png',
      '/projects/bad-chilli-peppers/death.png',
      '/projects/bad-chilli-peppers/success.png',
    ],
    title: 'Bad Chilli Peppers',
    metadata: ['C++', 'OpenGL', 'FreeType', 'GLFW', 'glm'],
    url: 'https://simn03.github.io/bad-chilli-peppers/',
    page: '/projects/bad-chilli-peppers',
    description: [
      '2D arcade game with a focus on level design and fire mechanics to interact with the environment.',
      'Created a tutorial framework with state management, context-sensitive prompts, and progression tracking',
      'Integrated FreeType for dynamic font loading with dynamic text placement for wrapping and centering.',
      'Created a particle system using instanced rendering to create thousands of smoke particles at high framerates',
      'Improved framerate by 25% by switching to an alert-based system instead of polling where applicable',
      'Coordinated with a team of 6 developers and artists using agile with active testing at all stages.',
    ],
  },
  {
    images: ['/projects/mediahub/mediahub.png'],
    title: 'MediaHub',
    metadata: ['MySQL', 'TypeScript', 'React', 'Express.js', 'Tailwind CSS'],
    url: 'https://youtu.be/ZULMZre-GnM',
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
    images: ['/projects/campus-explorer/ubc-campus-explorer.png'],
    title: 'UBC Dataset Explorer',
    metadata: ['TypeScript', 'React', 'Express.js', 'Tailwind CSS'],
    url: 'https://www.youtube.com/watch?v=un5eN5aV-BU',
    page: '/projects/ubc-dataset-explorer',
    description: [
      'Developed a single-page website for querying a comprehensive UBC dataset encompassing campus information, including courses, sections, and building details.',
      'Employed TypeScript to build querying logic. Utilized Express.js to create a server hosting the API.',
      'Backend Logic includes Parsing Data, Validating Data, Parsing Query, Validating Query, Collecting Query, Aggregating Query Results, Sorting Query Results.',
      'Adopted Test Driven Development (TDD) throughout the project to ensure rigorous testing and quality assurance at every stage.'
    ],
  },
  {
    images: ['/projects/focus-media/focus-media.png'],
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
    images: ['/projects/food-inventory/food-inventory.png'],
    title: 'Food Inventory App',
    metadata: ['Java', 'Android Studio', 'XML', 'archived'],
    url: 'https://github.com/simrit-nijjar/food-inventory-app',
    page: '/projects/food-inventory',
    description: [
      "Created an inventory application for both pantry and refrigerated foods to track expiration dates of perishable items and promote less food wastage.",
      "Allows creation and editing of new food items using an XML frontend along with handling and storage of data using Java.",
      "Designed and implemented in Java using Android Studio."
    ],
  },
  {
    images: ['/projects/budget-app/budget-app.png'],
    title: 'Budget App',
    metadata: ['Java', 'JUnit', 'Swing', 'JSON', 'archived'],
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
    images: ['/projects/pulsar-star/pulsar-star.png'],
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
    images: ['/projects/dress-portfolio/dress-portfolio.png'],
    title: 'Dress Portfolio Site',
    metadata: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'archived'],
    url: 'https://github.com/simrit-nijjar/Dress-Design-Portfolio',
    page: '/projects/dress-portfolio',
    description: [
      "Created an online portfolio to display custom clothing designs.",
      "Used Bootstrap to create dynamic UI elements, such as slideshows, transitioning text, unique overlay context windows for individual products.",
      "Designed to resize UI elements depending on the viewport dimensions using Bootstrap; implements a dynamic navigation pane to collapse for smaller displays."
    ],
  },
];

export default function ProjectsPage() {
  return (
    <>
      <RevealOnScroll>

        <Section
          className={`flex flex-col gap-10 mt-screen`}
          id={'projects'}
          header={`Projects`}
          tagline={`A collection of my projects, showcasing my skills and interests in various fields.`}
          items={items}
        />

      </RevealOnScroll>
    </>
  )
}