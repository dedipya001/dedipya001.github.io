export interface RAGDocument {
  id: string;
  title: string;
  content: string;
  category: 'bio' | 'projects' | 'experience' | 'skills' | 'achievements' | 'education' | 'other';
  tags?: string[];
  source: string;
}

export const initialDocuments: RAGDocument[] = [
  // --- BIOGRAPHY / ABOUT ---
  {
    id: "bio-1",
    title: "Who is Dedipya Goswami?",
    category: "bio",
    tags: ["bio", "about", "philosophy"],
    source: "about_me.txt",
    content: "Dedipya Goswami is a highly skilled AI & Backend Software Engineer and builder. He specializes in designing scalable backend architectures, implementing Retrieval-Augmented Generation (RAG) pipelines, building Model Context Protocol (MCP) servers, and deploying production-ready AI infrastructure. Driven by first-principles engineering, Dedipya bridges the gap between complex language models and high-throughput systems."
  },
  {
    id: "bio-2",
    title: "Dedipya's Engineering Philosophy",
    category: "bio",
    tags: ["philosophy", "motivation"],
    source: "philosophy.txt",
    content: "Dedipya approaches systems architecture with a focus on minimalism, speed, and observability. He believes that backend systems should be silent, resilient, and highly optimized, while AI integrations should feel organic rather than forced. His workflow centers on building secure broker validation layers, telemetry setups, and modular software designs."
  },

  // --- PROJECTS ---
  {
    id: "proj-1",
    title: "Encye RAG Integration",
    category: "projects",
    tags: ["RAG", "Python", "LangChain", "MongoDB", "Vector Search", "Google SDK"],
    source: "projects/encye_rag.md",
    content: "Encye RAG Integration: A SaaS platform capability developed by Dedipya enabling professionals to connect, collaborate, and share knowledge. It implements custom LangChain document pipelines, vector indexing on MongoDB, and Google SDK connectors to automate content indexing and article drafting. This system reduced document review times by 40%."
  },
  {
    id: "proj-2",
    title: "Salesforce CPQ AI Assistant",
    category: "projects",
    tags: ["FastAPI", "Python", "NLP", "Salesforce CPQ", "LLM", "RAG"],
    source: "projects/cpq_assistant.md",
    content: "Salesforce CPQ AI Assistant: An intelligent RAG + LLM assistant designed and implemented by Dedipya. It scrapes and structures Salesforce CPQ configuration metadata to feed LLMs, allowing Salesforce administrators to automatically generate complex CPQ rules, pricing logic, and configuration actions from natural language input."
  },
  {
    id: "proj-3",
    title: "One Interview - Prep Platform",
    category: "projects",
    tags: ["React", "Node.js", "Express.js", "SQL", "Postgres", "2FA"],
    source: "projects/one_interview.md",
    content: "One Interview: An interview preparation platform designed to assist SRM University students. Features secure user accounts with 2-Factor Authentication (2FA), a comprehensive question repository filtered by tags and popularity, and personalized interview experiences shared by seniors."
  },
  {
    id: "proj-4",
    title: "TrashTrace: Garbage Monitoring System",
    category: "projects",
    tags: ["Python", "FastAPI", "Computer Vision", "Machine Learning", "SMTP"],
    source: "projects/trashtrace.md",
    content: "TrashTrace: A city-wide garbage monitoring system analyzing real-time images from 100+ surveillance cameras using a custom formula-based computer vision model achieving 88% accuracy. Dispatches HTTP alerts and real-time SMTP emails upon threshold breaches. Co-authored and presented a research paper on model training at an IEEE conference in 2025."
  },

  // --- EXPERIENCE ---
  {
    id: "exp-1",
    title: "Backend Developer at Selegic India Pvt. Ltd.",
    category: "experience",
    tags: ["experience", "Selegic", "Python", "Node.js", "MCP", "RAG", "Salesforce CPQ"],
    source: "experience/selegic_developer.md",
    content: "Backend Developer at Selegic India Pvt. Ltd. (Oct 2025 - Present). Developing backend services and AI-driven capabilities for Encye, a SaaS collaboration platform. Built and deployed Model Context Protocol (MCP) servers and integrated LLM workflows for article generation using specialized SME persona tools. Designed and implemented the RAG-powered Salesforce CPQ Assistant and metadata pipelines."
  },
  {
    id: "exp-2",
    title: "DevOps Engineer Intern at Belzabar Software Design",
    category: "experience",
    tags: ["experience", "internship", "Belzabar", "Terraform", "Python", "AWS", "Prometheus", "Grafana"],
    source: "experience/belzabar_devops.md",
    content: "DevOps Engineer Intern at Belzabar Software Design Pvt. Ltd. (Sept 2024 - Jun 2025). Automated CI/CD pipelines and infrastructure provisioning using Terraform, Python, and Bash, accelerating release cycles by 22%. Built an AI-powered DevOps assistant that leverages RAG + LLMs to extract metadata from JAR files, automated database migrations, and optimized AWS infrastructure cost by 15%, reducing incident response time by 33% using CloudWatch, Prometheus, and Grafana."
  },
  {
    id: "exp-3",
    title: "Full Stack Web Developer Intern at Dot Sphere",
    category: "experience",
    tags: ["experience", "internship", "Dot Sphere", "React", "Express", "Node", "SEO"],
    source: "experience/dotsphere_intern.md",
    content: "Full Stack Web Developer Intern at Dot Sphere (Feb 2024 - Aug 2024). Built and extended the official Dot Sphere website, integrating interactive elements that boosted user engagement by 35%. Implemented SEO optimization strategies that increased organic web traffic by 50% and improved UI cross-device accessibility compatibility by 25%."
  },

  // --- SKILLS ---
  {
    id: "skill-1",
    title: "Languages and Core Concepts",
    category: "skills",
    tags: ["skills", "languages", "concepts", "DSA", "ML", "DevOps"],
    source: "skills/languages.txt",
    content: "Programming Languages: C, C++, Python, JavaScript, TypeScript, Bash. Core Concepts: Data Structures & Algorithms, Machine Learning, Computer Vision, Operating Systems, Computer Networks, RAG, LLM, DevOps."
  },
  {
    id: "skill-2",
    title: "Technologies and Frameworks",
    category: "skills",
    tags: ["skills", "frameworks", "tools", "Node", "Express", "React", "AWS", "Terraform"],
    source: "skills/technologies.txt",
    content: "Backend/Frontend Technologies: Node.js, Express.js, React.js, Angular, SQL, Postgres, MongoDB, Redis, AWS (EC2, S3, CloudWatch), Terraform, Grafana, Prometheus, Git/Github, Salesforce Admin, Codex, n8n."
  },

  // --- EDUCATION ---
  {
    id: "edu-1",
    title: "Collegiate and High School Foundations",
    category: "education",
    tags: ["education", "SRM", "Hem Sheela", "CGPA"],
    source: "education/education.md",
    content: "B.Tech in Computer Science Engineering at SRM University, AP (2021 - 2025) with a CGPA of 8.83/10. Awarded a 100% academic performance scholarship. Completed Class 12th CBSE in 2021 (93.8%) and Class 10th CBSE in 2019 (94.4%) at Hem Sheela Model School."
  },

  // --- ACHIEVEMENTS ---
  {
    id: "ach-1",
    title: "Achievements, Hackathons, and Scholarships",
    category: "achievements",
    tags: ["achievements", "scholarships", "hackathons", "IEEE"],
    source: "achievements/awards.md",
    content: "Eearned a 100% tuition scholarship at SRM University AP based on academic success. Secured a top 5 position out of 70 competing teams at the HackSRM 5.0 national hackathon with the project 'Camera Doodler'. Co-authored and presented a research paper on computer vision garbage monitoring at an IEEE conference in 2025. Deputy Leader and Core Team Member at IndustreeOwl managing 3 teams."
  }
];
