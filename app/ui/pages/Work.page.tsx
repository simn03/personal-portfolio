"use client"

import Section from "../components/section/Section.component";
import RevealOnScroll from "../components/home/RevealOnScroll.component";
import { ItemType } from "../../lib/Definitions";
import dayjs from "dayjs";

const items: ItemType[] = [
  {
    startDate: dayjs('2024-04-28'),
    endDate: dayjs('2024-12-31'),
    images: [
      '/work/ontraccr/logo.png',
    ],
    title: 'Ontraccr',
    metadata: ['MySQL', 'JavaScript', 'React', 'React Native', 'hapi.js', 'knex.js', 'AWS Lambda'],
    url: 'https://www.ontraccr.com/',
    page: '/work/ontraccr',
    description: [
      'Full-Stack Web Developer Coop',
      'Exponentially improved page loading times through file downloading optimizations on both web and mobile platforms.',
      'Used AWS lambda to create image thumbnails to reduce file size and improve loading times.',
      'Improved user workflow by implementing inline editing of all table data types on both web and mobile platforms.',
      'Implemented data exports by refactoring and transitioning the existing data export system to the backend',
    ],
  },
];

export default function WorkPage() {
  return (
    <>
      <RevealOnScroll>

        <Section
          className={`flex flex-col gap-10 mt-screen`}
          id={'work'}
          header={`Work`}
          tagline={`Some work I've done in the past relevant to my career.`}
          items={items}
          isList
        />

      </RevealOnScroll>
    </>
  )
}