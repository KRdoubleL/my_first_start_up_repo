export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  requiredSkills: string[];
  description: string;
  matchPercentage?: number;
}

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Berlin, Germany',
    salary: '€60,000 - €80,000',
    requiredSkills: ['React', 'TypeScript', 'CSS', 'JavaScript', 'Git'],
    description: 'We are looking for a passionate Frontend Developer to join our growing team. You will work on building modern web applications using React and TypeScript.',
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'StartupHub',
    location: 'Remote',
    salary: '€70,000 - €90,000',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS'],
    description: 'Join our dynamic startup as a Full Stack Developer. Work on exciting projects with modern technologies and shape the future of our product.',
  },
  {
    id: '3',
    title: 'React Native Developer',
    company: 'MobileFirst GmbH',
    location: 'Munich, Germany',
    salary: '€65,000 - €85,000',
    requiredSkills: ['React Native', 'JavaScript', 'iOS', 'Android', 'Redux'],
    description: 'Build beautiful mobile applications for iOS and Android using React Native. Work with a talented team on apps used by millions.',
  },
  {
    id: '4',
    title: 'Senior Frontend Engineer',
    company: 'BigTech Solutions',
    location: 'Hamburg, Germany',
    salary: '€80,000 - €100,000',
    requiredSkills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Testing'],
    description: 'Lead frontend development initiatives and mentor junior developers. Work on large-scale applications serving enterprise clients.',
  },
  {
    id: '5',
    title: 'JavaScript Developer',
    company: 'WebAgency Pro',
    location: 'Frankfurt, Germany',
    salary: '€55,000 - €70,000',
    requiredSkills: ['JavaScript', 'HTML', 'CSS', 'jQuery', 'WordPress'],
    description: 'Create interactive websites and web applications for our diverse client base. Experience with modern JavaScript frameworks is a plus.',
  },
  {
    id: '6',
    title: 'UI/UX Developer',
    company: 'DesignStudio',
    location: 'Berlin, Germany',
    salary: '€60,000 - €75,000',
    requiredSkills: ['React', 'CSS', 'Figma', 'JavaScript', 'Animation'],
    description: 'Bridge the gap between design and development. Implement beautiful, responsive interfaces and smooth animations.',
  },
  {
    id: '7',
    title: 'Backend Developer',
    company: 'DataSystems Inc',
    location: 'Remote',
    salary: '€70,000 - €95,000',
    requiredSkills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Redis'],
    description: 'Build robust backend systems and APIs. Work on data-intensive applications with focus on performance and scalability.',
  },
  {
    id: '8',
    title: 'DevOps Engineer',
    company: 'CloudOps GmbH',
    location: 'Cologne, Germany',
    salary: '€75,000 - €95,000',
    requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
    description: 'Manage cloud infrastructure and deployment pipelines. Ensure high availability and performance of our services.',
  },
];