import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, WorkMode } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const opportunities = [
  {
    title: "Youth Digital Skills Fellowship",
    organization: "Kabul Future Lab",
    category: "Training Program",
    location: "Kabul",
    country: "Afghanistan",
    workMode: WorkMode.HYBRID,
    employmentType: "Part-time fellowship",
    deadline: new Date("2026-10-15T23:59:00.000Z"),
    description:
      "A fictional 10-week fellowship introducing Afghan youth to web basics, online collaboration, and career planning.",
    requirements: [
      "Age 18-28",
      "Basic computer literacy",
      "Available for weekly in-person workshops",
    ],
    applyLink: "https://example.com/apply/youth-digital-skills",
    tags: ["digital-skills", "career-readiness", "youth"],
    featured: true,
  },
  {
    title: "Remote Junior Data Assistant",
    organization: "Horizon Research Collective",
    category: "Remote Work",
    location: "Online",
    country: "Remote",
    workMode: WorkMode.REMOTE,
    employmentType: "Contract",
    deadline: new Date("2026-11-02T23:59:00.000Z"),
    description:
      "A fictional remote role supporting spreadsheet cleanup, survey tagging, and simple research summaries.",
    requirements: [
      "Strong attention to detail",
      "Comfortable with spreadsheets",
      "Reliable internet connection",
    ],
    applyLink: "https://example.com/apply/remote-data-assistant",
    tags: ["data", "remote", "entry-level"],
    featured: false,
  },
  {
    title: "Women in STEM Scholarship",
    organization: "Bright Path Education Fund",
    category: "Scholarship",
    location: "Herat",
    country: "Afghanistan",
    workMode: WorkMode.ONSITE,
    employmentType: "Scholarship",
    deadline: new Date("2026-12-01T23:59:00.000Z"),
    description:
      "A fictional scholarship for young women pursuing science, technology, engineering, or mathematics studies.",
    requirements: [
      "High school transcript",
      "Personal statement",
      "Proof of admission or application",
    ],
    applyLink: "https://example.com/apply/women-stem-scholarship",
    tags: ["scholarship", "stem", "women"],
    featured: true,
  },
  {
    title: "Community Health Volunteer",
    organization: "Neighborhood Care Initiative",
    category: "Volunteer",
    location: "Mazar-i-Sharif",
    country: "Afghanistan",
    workMode: WorkMode.ONSITE,
    employmentType: "Volunteer",
    deadline: new Date("2026-09-30T23:59:00.000Z"),
    description:
      "A fictional volunteer opportunity supporting health awareness sessions for youth and families.",
    requirements: [
      "Interest in public health",
      "Dari or Pashto communication skills",
      "Available two afternoons per week",
    ],
    applyLink: "https://example.com/apply/community-health-volunteer",
    tags: ["health", "volunteer", "community"],
    featured: false,
  },
  {
    title: "Frontend Web Development Internship",
    organization: "CodeBridge Studio",
    category: "Internship",
    location: "Online",
    country: "Remote",
    workMode: WorkMode.REMOTE,
    employmentType: "Internship",
    deadline: new Date("2026-10-28T23:59:00.000Z"),
    description:
      "A fictional internship for beginners interested in React, accessibility, and portfolio projects.",
    requirements: [
      "Basic HTML and CSS knowledge",
      "One small coding sample",
      "Availability for mentor check-ins",
    ],
    applyLink: "https://example.com/apply/frontend-internship",
    tags: ["frontend", "react", "internship"],
    featured: true,
  },
  {
    title: "English for Career Readiness Course",
    organization: "Global Learning Rooms",
    category: "Online Course",
    location: "Online",
    country: "Remote",
    workMode: WorkMode.REMOTE,
    employmentType: "Self-paced course",
    deadline: new Date("2027-01-10T23:59:00.000Z"),
    description:
      "A fictional online course focused on CV writing, interview vocabulary, and workplace communication.",
    requirements: [
      "Beginner English level",
      "Mobile or computer access",
      "Commitment to weekly practice",
    ],
    applyLink: "https://example.com/apply/english-career-course",
    tags: ["english", "career", "online-course"],
    featured: false,
  },
  {
    title: "Agriculture Innovation Trainee",
    organization: "Green Valley Skills Center",
    category: "Training Program",
    location: "Bamyan",
    country: "Afghanistan",
    workMode: WorkMode.ONSITE,
    employmentType: "Traineeship",
    deadline: new Date("2026-11-20T23:59:00.000Z"),
    description:
      "A fictional hands-on program covering greenhouse basics, irrigation planning, and small farm business skills.",
    requirements: [
      "Interest in agriculture",
      "Able to attend practical sessions",
      "No previous experience required",
    ],
    applyLink: "https://example.com/apply/agriculture-trainee",
    tags: ["agriculture", "training", "rural-youth"],
    featured: false,
  },
  {
    title: "Junior Communications Officer",
    organization: "New Voices Media Hub",
    category: "Job",
    location: "Kandahar",
    country: "Afghanistan",
    workMode: WorkMode.HYBRID,
    employmentType: "Full-time",
    deadline: new Date("2026-10-05T23:59:00.000Z"),
    description:
      "A fictional entry-level communications role supporting newsletters, social posts, and event updates.",
    requirements: [
      "Strong writing skills",
      "Experience with social media tools",
      "Dari and Pashto preferred",
    ],
    applyLink: "https://example.com/apply/junior-communications",
    tags: ["communications", "media", "job"],
    featured: true,
  },
  {
    title: "Regional Peacebuilding Workshop",
    organization: "Youth Dialogue Network",
    category: "Training Program",
    location: "Dushanbe",
    country: "Tajikistan",
    workMode: WorkMode.ONSITE,
    employmentType: "Workshop",
    deadline: new Date("2026-12-12T23:59:00.000Z"),
    description:
      "A fictional regional workshop for young community leaders interested in dialogue and conflict resolution.",
    requirements: [
      "Age 20-30",
      "Community project experience",
      "Valid travel document",
    ],
    applyLink: "https://example.com/apply/peacebuilding-workshop",
    tags: ["leadership", "peacebuilding", "regional"],
    featured: false,
  },
  {
    title: "Undergraduate Access Grant",
    organization: "Step Forward Scholars",
    category: "Scholarship",
    location: "Islamabad",
    country: "Pakistan",
    workMode: WorkMode.HYBRID,
    employmentType: "Scholarship",
    deadline: new Date("2027-02-01T23:59:00.000Z"),
    description:
      "A fictional grant supporting Afghan students applying to undergraduate programs in the region.",
    requirements: [
      "Academic records",
      "Financial need statement",
      "Two references",
    ],
    applyLink: "https://example.com/apply/undergraduate-access-grant",
    tags: ["scholarship", "undergraduate", "regional"],
    featured: false,
  },
  {
    title: "Small Business Operations Assistant",
    organization: "MarketLink Services",
    category: "Job",
    location: "Jalalabad",
    country: "Afghanistan",
    workMode: WorkMode.ONSITE,
    employmentType: "Full-time",
    deadline: new Date("2026-09-25T23:59:00.000Z"),
    description:
      "A fictional operations role helping a small business team with inventory records and customer coordination.",
    requirements: [
      "Basic accounting knowledge",
      "Customer service mindset",
      "Comfortable using office software",
    ],
    applyLink: "https://example.com/apply/operations-assistant",
    tags: ["business", "operations", "entry-level"],
    featured: false,
  },
  {
    title: "Climate Storytelling Micro-Grant",
    organization: "Open Lens Youth Fund",
    category: "Volunteer",
    location: "Online",
    country: "Remote",
    workMode: WorkMode.REMOTE,
    employmentType: "Project grant",
    deadline: new Date("2027-03-15T23:59:00.000Z"),
    description:
      "A fictional micro-grant for youth teams producing short digital stories about climate resilience.",
    requirements: [
      "Team of two to four youth",
      "Short project proposal",
      "Sample photo, audio, or video work",
    ],
    applyLink: "https://example.com/apply/climate-storytelling",
    tags: ["climate", "storytelling", "grant"],
    featured: true,
  },
];

async function main() {
  await prisma.opportunity.deleteMany();
  await prisma.opportunity.createMany({ data: opportunities });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
