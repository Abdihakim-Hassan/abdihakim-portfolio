import { EducationMilestone, Project, ServiceItem, SkillProgress } from '../types';

import abdihakimPhoto from '../assets/images/abdihakim_real_transparent.png';
import shaqokaabBrandImg from '../assets/images/project_shaqokaab_brand.jpg';
import shaqokaabAtsImg from '../assets/images/project_shaqokaab_ats.jpg';
import tukoPosterImg from '../assets/images/project_tuko_poster.jpg';
import hubaalImg from '../assets/images/project_fintech_platform_1791984897116.jpg';
import abdihakimDevImg from '../assets/images/project_abdihakim_dev.jpg';

export const PORTFOLIO_OWNER = {
  fullName: 'Abdihakim Hassan Mohamud',
  name: 'Eng Abdihakim Hassan',
  shortBrand: 'ABDIHAKIM',
  monogram: 'A',
  backdropText: 'ABDIHAKIM HASSAN',
  role: {
    so: 'Arday Software Engineering ka dhigta Jaamacadda Jamhuriya (JUST) ee Muqdisho, Soomaaliya',
    en: 'Aspiring Software Engineering Student at Jamhuriya University in Mogadishu, Somalia',
  },
  university: 'Jamhuriya University of Science and Technology (JUST)',
  portrait: abdihakimPhoto,
  location: 'Mogadishu, Somalia',
  email: 'ccakiincasan@gmail.com',
  gmailLink: 'mailto:ccakiincasan@gmail.com?subject=Hello%20Eng%20Abdihakim%20Hassan',
  whatsapp: '+252 61 399 3775',
  whatsappLink: 'https://wa.me/252613993775',
  githubHandle: 'Abdihakim-Hassan',
  github: 'https://github.com/Abdihakim-Hassan',
  linkedin: 'https://www.linkedin.com/in/abdihakim-hassan-094502392',
  tiktokHandle: '@abdihakim.dev',
  tiktok: 'https://www.tiktok.com/@abdihakim.dev',
};

export const PROJECTS_DATA: Project[] = [
  {
    id: 'shaqokaab',
    index: '01',
    title: {
      so: 'ShaqoKaab - Isku-xiraha Shirkadaha & Xirfadlayaasha Soomaaliyeed',
      en: 'ShaqoKaab - Isku-xiraha Shirkadaha & Xirfadlayaasha Soomaaliyeed',
    },
    tagline: {
      so: 'Isku-xiraha Shirkadaha & Xirfadlayaasha Soomaaliyeed. Barxadda koowaad ee shaqooyinka dalka oo leh ogeysiisyada tooska ah ee WhatsApp & SMS iyo AI caawiyaha CV-yada.',
      en: 'Isku-xiraha Shirkadaha & Xirfadlayaasha Soomaaliyeed. Barxadda koowaad ee shaqooyinka dalka oo leh ogeysiisyada tooska ah ee WhatsApp & SMS iyo AI caawiyaha CV-yada.',
    },
    category: 'web',
    categoryLabel: {
      so: 'ShaqoKaab · Live App',
      en: 'ShaqoKaab · Live App',
    },
    stackLabel: 'REACT 19 · NODE.JS · TYPESCRIPT · TAILWIND CSS · WEBSOCKETS',
    image: shaqokaabBrandImg,
    year: '2026',
    client: 'ShaqoKaab',
    featured: true,
    technologies: ['React', 'Node.js', 'JavaScript', 'CSS3', 'HTML5'],
    metrics: [
      { label: { so: 'Magaca', en: 'Application' }, value: 'ShaqoKaab' },
      { label: { so: 'Nidaamka', en: 'Core Features' }, value: 'Job Portal, Kanban ATS & AI CV' },
      { label: { so: 'Ogeysiisyada', en: 'Notifications' }, value: 'WhatsApp & SMS Alerts' },
    ],
    overview: {
      so: 'Isku-xiraha Shirkadaha & Xirfadlayaasha Soomaaliyeed. Barxadda koowaad ee shaqooyinka dalka oo leh ogeysiisyada tooska ah ee WhatsApp & SMS iyo AI caawiyaha CV-yada.',
      en: 'Isku-xiraha Shirkadaha & Xirfadlayaasha Soomaaliyeed. Barxadda koowaad ee shaqooyinka dalka oo leh ogeysiisyada tooska ah ee WhatsApp & SMS iyo AI caawiyaha CV-yada.',
    },
    architecture: {
      so: 'React 19, TypeScript, Tailwind CSS, Node.js, Express, Firebase, iyo WebSockets (ws).',
      en: 'React 19, TypeScript, Tailwind CSS, Node.js, Express, Firebase, and WebSockets (ws).',
    },
    challenge: {
      so: 'Isku-xirka shirkadaha iyo xirfadlayaasha Soomaaliyeed iyadoo la adeegsanayo madal casri ah oo leh Kanban ATS, Candidate & Employer Portals, iyo ogeysiisyada WhatsApp/SMS.',
      en: 'Connecting Somali employers and professionals with an integrated job portal, Kanban ATS board, AI CV assistant, and instant WhatsApp/SMS alerts.',
    },
    solution: {
      so: 'Barxadda ShaqoKaab oo siday tahay u shaqaynaysa: shaqo raadin, diiwaangelinta shirkadaha iyo shaqo-doonka, Kanban ATS, Live Chat, iyo CV dhisid.',
      en: 'Complete ShaqoKaab platform running live with job listings, employer & candidate portals, Kanban ATS pipeline, live chat, and CV builder.',
    },
    liveAppUrl: '/projects/shaqokaab/index.html',
    demoUrl: '/projects/shaqokaab/index.html',
    githubUrl: 'https://github.com/Abdihakim-Hassan',
  },
  {
    id: 'tuko-salaad',
    index: '02',
    title: {
      so: 'Tuko — Salaad & Adhkaar Soomaali',
      en: 'Tuko — Salaad & Adhkaar Soomaali',
    },
    tagline: {
      so: "Tuko – App-ka Casriga ah ee Ilaalinta Salaadaha, Dikriga & Qur'aanka Soomaaliya oo leh waqtiyo toos ah, diiwaangelin, iyo xog-kaydin cloud ah.",
      en: "Tuko – App-ka Casriga ah ee Ilaalinta Salaadaha, Dikriga & Qur'aanka Soomaaliya oo leh waqtiyo toos ah, diiwaangelin, iyo xog-kaydin cloud ah.",
    },
    category: 'web',
    categoryLabel: {
      so: 'Tuko · Dhawr-Salaad & Adkaar',
      en: 'Tuko · Dhawr-Salaad & Adkaar',
    },
    stackLabel: 'REACT 19 · TYPESCRIPT · TAILWIND CSS · FIREBASE · NODE.JS',
    image: tukoPosterImg,
    year: '2026',
    client: 'Tuko App',
    featured: true,
    technologies: ['React', 'Node.js', 'JavaScript', 'CSS3', 'HTML5'],
    metrics: [
      { label: { so: 'Magaca App-ka', en: 'App Name' }, value: 'Tuko — Salaad & Adhkaar' },
      { label: { so: 'Qaybaha', en: 'Modules' }, value: 'Salaad, Aadaan, Adhkaar, Qibla, Qur\'aan' },
      { label: { so: 'Xog-Kaydin', en: 'Cloud Sync' }, value: 'Firebase & Cross-Device Sync' },
    ],
    overview: {
      so: "App-ka Casriga ah ee Salaadaha, Dikriga & Adhkaarta Soomaaliya oo leh waqtiyo toos ah, diiwaangelin, iyo xog-kaydin otomaatig ah.",
      en: "App-ka Casriga ah ee Salaadaha, Dikriga & Adhkaarta Soomaaliya oo leh waqtiyo toos ah, diiwaangelin, iyo xog-kaydin otomaatig ah.",
    },
    architecture: {
      so: 'React 19, TypeScript, Tailwind CSS, Firebase Authentication & Firestore, PWA support, iyo Node.js/Express cross-device sync.',
      en: 'React 19, TypeScript, Tailwind CSS, Firebase Authentication & Firestore, PWA support, and Node.js/Express cross-device sync.',
    },
    challenge: {
      so: 'Dhisidda app casri ah oo Soomaaliyeed oo lagu ilaaliyo salaadaha, adhkaarta maalinlaha ah, akhriska Qur\'aanka, soonka, tasbiixda, iyo jihooyinka Qiblada.',
      en: 'Building a comprehensive Somali Islamic companion app for tracking daily prayers, Adhan alarms, Adhkaar, Quran reading, fasting, Tasbeeh, and Qibla direction.',
    },
    solution: {
      so: 'App-ka Tuko (Dhawr-Salaad & Adkaar) oo sidiisa u dhammaystiran lehna waqtiyada salaadaha magaalooyinka Soomaaliya, Aadaan toos ah, Qibla, Qur\'aan, iyo Cloud Sync.',
      en: 'Complete live Tuko application featuring real-time prayer schedules across Somali cities, Adhan audio alerts, Qibla compass, Quran tracker, Adhkaar, and cloud sync.',
    },
    liveAppUrl: '/projects/tuko-salaad/index.html',
    demoUrl: '/projects/tuko-salaad/index.html',
    githubUrl: 'https://github.com/Abdihakim-Hassan',
  },
  {
    id: 'hubaal-pos',
    index: '03',
    title: {
      so: 'Hubaal — Nidaamka Ganacsiga & Xisaabaadka ee Casriga ah',
      en: 'Hubaal — Smart POS & Cloud Inventory Management',
    },
    tagline: {
      so: 'Nidaam ganacsi oo casri ah oo loogu talagalay shirkadaha Soomaaliyeed: iibinta tooska ah, maamulka bakhaarrada, lacagaha EVC Plus/Edahab, iyo warbixinno maaliyadeed.',
      en: 'Modern point-of-sale and inventory system tailored for Somali businesses: real-time sales, multi-store stock tracking, EVC Plus / Edahab payment reconciliation, and analytics.',
    },
    category: 'web',
    categoryLabel: {
      so: 'Hubaal · Smart POS',
      en: 'Hubaal · Smart POS',
    },
    stackLabel: 'REACT 19 · TYPESCRIPT · TAILWIND CSS · NODE.JS · POSTGRESQL',
    image: hubaalImg,
    year: '2026',
    client: 'Hubaal Commerce',
    featured: true,
    technologies: ['React', 'Node.js', 'JavaScript', 'CSS3', 'HTML5'],
    metrics: [
      { label: { so: 'Nidaamka', en: 'Platform' }, value: 'Cloud POS & Stock Engine' },
      { label: { so: 'Lacagaha', en: 'Mobile Money' }, value: 'EVC Plus, Edahab, Zaad' },
      { label: { so: 'Warbixinno', en: 'Analytics' }, value: 'Real-time Daily Audits' },
    ],
    overview: {
      so: "Nidaam dhameystiran oo xisaabaadka iyo iibka ganacsiyada Soomaaliya loogu talagalay oo leh diiwaangelinta alaabta, rasiidhada elektaroonigga ah, iyo la-socodka faa'iidada.",
      en: 'Comprehensive Somali business POS and cloud inventory suite featuring item barcoding, digital thermal receipts, profit tracking, and cashier access control.',
    },
    architecture: {
      so: 'React 19, TypeScript, Tailwind CSS, Node.js, Express, PostgreSQL relational database, iyo RESTful API architecture.',
      en: 'React 19, TypeScript, Tailwind CSS, Node.js, Express, PostgreSQL relational database, and RESTful API architecture.',
    },
    challenge: {
      so: "Xalinta dhibaatada xisaab-xirka gacanta lagu qoro ee dukaamada Muqdisho iyadoo la dhisayo nidaam degdeg ah oo internet la'aan iyo internet labadaba ku shaqayn kara.",
      en: 'Eliminating manual ledger errors for Mogadishu merchants with an ultra-responsive offline-capable cloud sync retail POS architecture.',
    },
    solution: {
      so: 'Nidaamka Hubaal POS oo awood u leh inuu hal mar qabto lacag-bixinta mobile money, daabaco rasiidhyada, una soo saaro maamulaha warbixinta maalinlaha ah.',
      en: 'Hubaal POS platform handling rapid mobile checkout, barcode scanning, thermal receipt generation, and executive financial summaries.',
    },
    liveAppUrl: 'https://github.com/Abdihakim-Hassan',
    demoUrl: 'https://github.com/Abdihakim-Hassan',
    githubUrl: 'https://github.com/Abdihakim-Hassan',
  },
  {
    id: 'abdihakim-dev',
    index: '04',
    title: {
      so: 'Abdihakim.Dev — Nidaamka Portfolio & Cloud CMS',
      en: 'Abdihakim.Dev — Personal Portfolio OS & Cloud CMS',
    },
    tagline: {
      so: 'Nidaam Full-Stack ah oo casri ah oo leh Dashboard maamul oo toos ugu xiran Google Cloud Firestore, Firebase Authentication, iyo xog-kaydin Local-First ah.',
      en: 'Modern Full-Stack developer portfolio & CMS platform built with React 19, TypeScript, Google Cloud Firestore, Firebase Auth, and Local-First sync.',
    },
    category: 'web',
    categoryLabel: {
      so: 'Abdihakim.Dev · Live Platform',
      en: 'Abdihakim.Dev · Live Platform',
    },
    stackLabel: 'REACT 19 · TYPESCRIPT · TAILWIND CSS · CLOUD FIRESTORE · FIREBASE AUTH',
    image: abdihakimDevImg,
    year: '2026',
    client: 'Self-Initiated / Abdihakim Hassan',
    featured: true,
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Node.js'],
    metrics: [
      { label: { so: 'Madasha', en: 'Platform' }, value: 'Full-Stack Portfolio OS' },
      { label: { so: 'Database', en: 'Database' }, value: 'Google Cloud Firestore' },
      { label: { so: 'Amniga', en: 'Security' }, value: 'Role-Based Firebase Auth' },
    ],
    overview: {
      so: 'Nidaamka Abdihakim.Dev waa madal casri ah oo Full-Stack ah oo isku xiraysa portfolio-ga guud iyo Dashboard maamul oo awood badan (Full CRUD). Waxay leedahay xog-kaydin Local-First ah oo xawaare 0ms ah bixisa, iyadoo xogtu isla markiiba toos ugu xirmayso Google Cloud Firestore.',
      en: 'Abdihakim.Dev is a production-grade personal portfolio system combining a public showcase with an executive administrative CMS. Featuring a local-first reactive architecture with zero-latency updates and bidirectional synchronization to Google Cloud Firestore.',
    },
    architecture: {
      so: 'React 19, TypeScript, Tailwind CSS, Google Cloud Firestore, Firebase Authentication, iyo Local-First localStorage cache.',
      en: 'React 19, TypeScript, Tailwind CSS, Google Cloud Firestore, Firebase Authentication, and Local-First localStorage cache.',
    },
    challenge: {
      so: 'Dhisidda portfolio aan ahayn kaliya bog static ah, balse ah nidaam software ah oo dhameystiran oo maamulaha u oggolaanaya inuu mashaariicda ku daro, wax ka beddelo, kana tirtiro isagoo adeegsanaya Google Cloud Firestore ammaan ah.',
      en: 'Architecting an engineering-first personal brand platform that goes beyond static pages into a complete software product: offering full dynamic project management, contact synchronization, and authenticated Google OAuth administration.',
    },
    solution: {
      so: 'Madasha Abdihakim.Dev oo si toos ah u shaqaynaysa: Dashboard maamul oo qarsoon (/#dashboard), mashaariic toos loogu shubo Cloud Firestore, iyo fariimaha macaamiisha oo toos looga maamulo.',
      en: 'The live Abdihakim.Dev platform: secure hash-routed owner portal (/#dashboard), real-time Firestore database synchronization, and automated bilingual Som/Eng switching.',
    },
    liveAppUrl: 'https://abdihakim-portfolio-1.vercel.app',
    demoUrl: 'https://abdihakim-portfolio-1.vercel.app',
    githubUrl: 'https://github.com/Abdihakim-Hassan/abdihakim-portfolio',
  },
];

export const SKILLS_PROGRESS: SkillProgress[] = [
  {
    id: 'html5',
    name: { so: 'HTML5', en: 'HTML5' },
    percentage: 92,
    category: 'Frontend',
    stage: { so: 'Aasaaska Xooggan', en: 'Core Foundation' },
    description: {
      so: 'Semantic HTML5 markup, qaab-dhismeedka bogagga, accessible forms, iyo SEO metadata.',
      en: 'Semantic HTML5 architecture, accessible document landmarks, structured forms, and clean DOM hierarchy.',
    },
    topics: ['Semantic Markup', 'Accessible Forms', 'SEO Structure'],
  },
  {
    id: 'css3',
    name: { so: 'CSS3 & Tailwind CSS', en: 'CSS3 & Tailwind CSS' },
    percentage: 90,
    category: 'Frontend',
    stage: { so: 'Aasaaska Xooggan', en: 'Core Foundation' },
    description: {
      so: 'Flexbox, CSS Grid, responsive mobile-first design, custom properties, iyo Tailwind CSS.',
      en: 'Modern Flexbox, CSS Grid, fluid responsive layouts, dark/light theme systems, and Tailwind CSS.',
    },
    topics: ['CSS Grid & Flexbox', 'Tailwind CSS', 'Responsive UI'],
  },
  {
    id: 'javascript',
    name: { so: 'JavaScript (ES6+)', en: 'JavaScript (ES6+)' },
    percentage: 84,
    category: 'Frontend',
    stage: { so: 'Ku Shaqeyn Joogto ah', en: 'Active Practice' },
    description: {
      so: 'DOM manipulation, event handling, async/await, Fetch API, iyo modular ES6+ logic.',
      en: 'Modern ES6+ syntax, DOM scripting, asynchronous workflows, state logic, and modular architecture.',
    },
    topics: ['ES6+ Modules', 'DOM & Events', 'Async / Fetch API'],
  },
  {
    id: 'react',
    name: { so: 'React & TypeScript', en: 'React & TypeScript' },
    percentage: 82,
    category: 'Frontend',
    stage: { so: 'Horumarin Joogto ah', en: 'Growing Focus' },
    description: {
      so: 'Component-driven UI development, React Hooks (useState, useEffect), props, iyo TypeScript types.',
      en: 'Component-based architecture, React 19 hooks, state management, and type-safe UI engineering.',
    },
    topics: ['React 19', 'Hooks & State', 'TypeScript'],
  },
  {
    id: 'nodejs',
    name: { so: 'Node.js', en: 'Node.js' },
    percentage: 78,
    category: 'Backend',
    stage: { so: 'Sahamin & Dhisid', en: 'Exploring & Building' },
    description: {
      so: 'Server-side JavaScript, Express APIs, WebSockets (ws), iyo isku-xirka full-stack.',
      en: 'Server-side JavaScript runtime, Express APIs, WebSocket real-time communication, and full-stack integration.',
    },
    topics: ['Node.js & Express', 'WebSockets', 'REST APIs'],
  },
  {
    id: 'git-tools',
    name: { so: 'Git, GitHub & AI Foundations', en: 'Git, GitHub & AI Foundations' },
    percentage: 86,
    category: 'Tools',
    stage: { so: 'Qalabka Joogtada ah', en: 'Daily Workflow' },
    description: {
      so: 'Version control (Git/GitHub), Elements of AI, iyo qoraalka degdegga ah (Touch Typing).',
      en: 'Version control with Git & GitHub, Elements of AI principles, and high-speed touch typing.',
    },
    topics: ['Git & GitHub', 'Elements of AI', 'Touch Typing'],
  },
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'frontend-engineering',
    title: {
      so: 'Frontend Web Engineering',
      en: 'Frontend Web Engineering',
    },
    description: {
      so: 'Dhisidda bogag internet oo nadiif ah, xawaare sare leh, kuna dhisan HTML5, CSS3, JavaScript, iyo React.',
      en: 'Building clean, responsive, and interactive web interfaces using HTML5, CSS3, JavaScript, and React.',
    },
    iconName: 'Code',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'React'],
  },
  {
    id: 'ui-ux-systems',
    title: {
      so: 'Minimalist UI/UX & Responsive Design',
      en: 'Minimalist UI/UX & Responsive Design',
    },
    description: {
      so: 'Naqshadaynta interface-yo casri ah oo leh dark/light mode iyo qaab-dhismeed si sax ah ugu shaqeeya mobile iyo desktop.',
      en: 'Crafting editorial dark/light interfaces, mobile-first layouts, and accessible component systems.',
    },
    iconName: 'Palette',
    technologies: ['Tailwind CSS', 'CSS Grid', 'Responsive UI'],
  },
  {
    id: 'backend-nodejs',
    title: {
      so: 'Node.js & Full-Stack Web Apps',
      en: 'Node.js & Full-Stack Web Apps',
    },
    description: {
      so: 'Horumarinta barnaamijyada web-ka ee isku xira React frontend iyo Node.js/Express backend sida ShaqoKaab.',
      en: 'Developing dynamic web applications that connect modern React frontends with Node.js backend logic and WebSockets.',
    },
    iconName: 'Server',
    technologies: ['Node.js', 'React', 'WebSockets', 'Git'],
  },
];

export const EDUCATION_JOURNEY: EducationMilestone[] = [
  {
    id: 'just-computer-application',
    title: {
      so: 'Computer Application',
      en: 'Computer Application',
    },
    institution: 'Jamhuriya University of Science and Technology (JUST)',
    location: 'Mogadishu, Somalia',
    period: '2026 – Present',
    image: shaqokaabAtsImg,
    badgeText: {
      so: 'WAXBARASHADA JAAMACADDA · JUST',
      en: 'UNIVERSITY EDUCATION · JUST',
    },
    description: {
      so: 'Waxaan hadda ka bartaa kuliyadda Computer Application (Software Engineering) ee Jaamacadda Jamhuriya (JUST) ee magaalada Muqdisho. Waxaan xoogga saaraa mabaadii\'da injineernimada software-ka, dhisidda web-ka, xallinta dhibaatooyinka, iyo koodhka nadiifka ah.',
      en: 'Currently pursuing my degree in Computer Application (Software Engineering) at Jamhuriya University of Science and Technology (JUST) in Mogadishu, Somalia. Focused on software engineering principles, web technologies, programming fundamentals, and collaborative problem-solving.',
    },
    skillsGained: ['Software Engineering', 'Algorithms & Data Structures', 'DBMS & SQL', 'Web Engineering'],
  },
];
