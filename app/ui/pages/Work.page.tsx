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
    metadata: ['MySQL', 'TypeScript', 'Vite', 'React', 'hapi.js', 'Tailwind CSS', 'AWS EC2', 'AWS S3', 'AWS RDS', 'AWS CloudFront', 'AWS SES', 'socket.io'],
    url: 'https://www.ontraccr.com/',
    page: '/work/ontraccr',
    description: [
      'Full-Stack Web Developer Coop',
      'Full-stack web application for managing equipment leasing and rental processes, including customer management, inventory tracking, and financial reporting.',
      'Role-based access control consisting of granular permissions in a subject-based access control (RBAC) system.',
      'JWT authentication with instant token refresh and revocation on user permission change',
      'Real-time notifications and chat system using socket.io.',
      'Ability to send application directly to lenders via email using AWS SES and S3 for attachments.',
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