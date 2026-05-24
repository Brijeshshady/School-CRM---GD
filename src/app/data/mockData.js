import { subMinutes, subHours, subDays } from "date-fns";
export const CURRENT_USER_ID = "parent-001";
export const currentUserProfile = {
  id: CURRENT_USER_ID,
  name: "System Parent",
  email: "parent@school.com",
  role: "Parent",
  avatar: "https://ui-avatars.com/api/?name=Parent&background=0D9488&color=fff"
};
export const mockUsers = [
  { id: "T001", name: "Ms. Priya Sharma", role: "Class Teacher", avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=0D9488&color=fff", online: true, lastActive: "2 min ago" },
  { id: "T002", name: "Mr. Rajesh Koothrappali", role: "Physics Teacher", avatar: "https://ui-avatars.com/api/?name=Rajesh+K&background=3B82F6&color=fff", online: false, lastActive: "1 hour ago" },
  { id: "T003", name: "Mrs. Anjali Gupta", role: "Math Teacher", avatar: "https://ui-avatars.com/api/?name=Anjali+Gupta&background=purple&color=fff", online: true, lastActive: "Just now" },
  { id: "T004", name: "Mr. Vikram Singh", role: "Sports Coach", avatar: "https://ui-avatars.com/api/?name=Vikram+Singh&background=orange&color=fff", online: false, lastActive: "3 hours ago" },
  { id: "T005", name: "Ms. Sneha Patel", role: "Art Teacher", avatar: "https://ui-avatars.com/api/?name=Sneha+Patel&background=pink&color=fff", online: true, lastActive: "5 min ago" },
  { id: "T006", name: "Neranjan", role: "Principal", avatar: "https://ui-avatars.com/api/?name=Neranjan&background=slate&color=fff", online: false, lastActive: "Yesterday" },
  { id: "T007", name: "Mrs. Kavita Reddy", role: "Science Teacher", avatar: "https://ui-avatars.com/api/?name=Kavita+Reddy&background=teal&color=fff", online: false, lastActive: "2 days ago" },
  { id: "T008", name: "Mr. Rahul Roy", role: "History Teacher", avatar: "https://ui-avatars.com/api/?name=Rahul+Roy&background=brown&color=fff", online: true, lastActive: "10 min ago" },
  { id: "T009", name: "Ms. Meera Iyer", role: "English Teacher", avatar: "https://ui-avatars.com/api/?name=Meera+Iyer&background=indigo&color=fff", online: true, lastActive: "1 min ago" },
  { id: "S001", name: "Admin Office", role: "Administration", avatar: "https://ui-avatars.com/api/?name=Admin+Office&background=gray&color=fff", online: true, lastActive: "Active" }
];
const generateMessages = (participantId) => {
  const baseTime = /* @__PURE__ */ new Date("2026-02-04T17:00:00");
  return [
    { id: `m-${participantId}-1`, senderId: CURRENT_USER_ID, text: "Namaste, I had a query regarding the upcoming exams.", timestamp: subDays(baseTime, 2), status: "read" },
    { id: `m-${participantId}-2`, senderId: participantId, text: "Hello! Yes, please go ahead.", timestamp: subDays(baseTime, 2), status: "read" },
    { id: `m-${participantId}-3`, senderId: CURRENT_USER_ID, text: "Will the syllabus include Chapter 5?", timestamp: subDays(baseTime, 1), status: "read" },
    { id: `m-${participantId}-4`, senderId: participantId, text: "Yes, Chapter 5 is included.", timestamp: subHours(baseTime, 5), status: "read" },
    { id: `m-${participantId}-5`, senderId: participantId, text: "Let me know if you need the study material.", timestamp: subHours(baseTime, 4), status: "read" },
    { id: `m-${participantId}-6`, senderId: CURRENT_USER_ID, text: "That would be helpful, thank you!", timestamp: subHours(baseTime, 1), status: "delivered" }
  ];
};
export const mockMessages = [];
export const mockThreads = [
  {
    id: "C001-T001",
    participantId: "T001",
    // Priya Sharma
    lastMessage: "Homework due tomorrow",
    lastMessageTime: /* @__PURE__ */ new Date("2026-02-04T17:00:00"),
    unreadCount: 3,
    messages: [
      ...generateMessages("T001"),
      { id: "m-T001-7", senderId: "T001", text: "Please ensure your child completes the worksheet.", timestamp: subMinutes(/* @__PURE__ */ new Date("2026-02-04T17:00:00"), 30), status: "read" },
      { id: "m-T001-8", senderId: "T001", text: "Homework due tomorrow", timestamp: /* @__PURE__ */ new Date("2026-02-04T17:00:00"), status: "delivered" }
    ]
  },
  {
    id: "C002-T003",
    participantId: "T003",
    // Anjali Gupta
    lastMessage: "Great progress in Math!",
    lastMessageTime: subHours(/* @__PURE__ */ new Date("2026-02-04"), 2),
    unreadCount: 0,
    messages: generateMessages("T003")
  },
  {
    id: "C003-T004",
    participantId: "T004",
    // Vikram Singh
    lastMessage: "Sports day practice schedule changed.",
    lastMessageTime: subDays(/* @__PURE__ */ new Date("2026-02-04"), 1),
    unreadCount: 1,
    messages: generateMessages("T004")
  },
  {
    id: "C004-S001",
    participantId: "S001",
    // Admin
    lastMessage: "Fee receipt for Feb 2026 generated.",
    lastMessageTime: subDays(/* @__PURE__ */ new Date("2026-02-04"), 3),
    unreadCount: 0,
    messages: generateMessages("S001")
  }
];
export const sampleCredentials = {
  parent: {
    email: "parent@example.com",
    password: "password123"
  },
  student: {
    studentId: "STU-2026-0142",
    password: "student123"
  },
  staff: {
    email: "priya.sharma@school.edu.in",
    password: "staff123"
  }
};
export const studentProfile = {
  id: "STU-2026-0142",
  name: "Aarav Kumar",
  class: "Class 10",
  section: "A",
  rollNo: 15,
  avatar: "https://ui-avatars.com/api/?name=Aarav+Kumar&background=3B82F6&color=fff",
  email: "aarav.kumar@school.edu.in",
  parentName: "Parent Name",
  dateOfBirth: "2010-08-15",
  bloodGroup: "O+",
  address: "B-204, Green Valley Apartments, Sector 22, Noida, UP 201301"
};
export const todaySchedule = [
  { id: "sch1", subject: "Mathematics", teacher: "Mrs. Anjali Gupta", room: "Room 201", startTime: "08:00", endTime: "09:00" },
  { id: "sch2", subject: "Physics", teacher: "Mr. Rajesh Koothrappali", room: "Lab 1", startTime: "09:00", endTime: "10:00" },
  { id: "sch3", subject: "Chemistry", teacher: "Mrs. Kavita Reddy", room: "Lab 2", startTime: "10:15", endTime: "11:15" },
  { id: "sch4", subject: "English", teacher: "Ms. Meera Iyer", room: "Room 105", startTime: "11:15", endTime: "12:15" },
  { id: "sch5", subject: "History", teacher: "Mr. Rahul Roy", room: "Room 303", startTime: "13:00", endTime: "14:00" },
  { id: "sch6", subject: "Physical Education", teacher: "Mr. Vikram Singh", room: "Sports Ground", startTime: "14:00", endTime: "15:00" }
];
export const mockAssignments = [
  { id: "a1", title: "Quadratic Equations Worksheet", subject: "Mathematics", description: "Solve problems 1-20 from Chapter 4", dueDate: /* @__PURE__ */ new Date("2026-02-08"), status: "pending" },
  { id: "a2", title: "Newton's Laws Lab Report", subject: "Physics", description: "Submit detailed experiment observations", dueDate: /* @__PURE__ */ new Date("2026-02-07"), status: "pending" },
  { id: "a3", title: "Chemical Bonding Notes", subject: "Chemistry", description: "Prepare detailed notes on ionic and covalent bonds", dueDate: /* @__PURE__ */ new Date("2026-02-10"), status: "submitted" },
  { id: "a4", title: "Essay on Climate Change", subject: "English", description: "Write 500-word essay with references", dueDate: /* @__PURE__ */ new Date("2026-02-05"), status: "graded", grade: "A" },
  { id: "a5", title: "Freedom Struggle Timeline", subject: "History", description: "Create a comprehensive timeline 1857-1947", dueDate: /* @__PURE__ */ new Date("2026-02-12"), status: "pending" },
  { id: "a6", title: "Sports Day Registration", subject: "Physical Education", description: "Register for athletics events", dueDate: /* @__PURE__ */ new Date("2026-02-15"), status: "submitted" }
];
export const mockAttendance = [
  { date: /* @__PURE__ */ new Date("2026-02-01"), status: "present" },
  { date: /* @__PURE__ */ new Date("2026-02-02"), status: "present" },
  { date: /* @__PURE__ */ new Date("2026-02-03"), status: "present" },
  { date: /* @__PURE__ */ new Date("2026-02-04"), status: "present" },
  { date: /* @__PURE__ */ new Date("2026-02-05"), status: "present" },
  { date: /* @__PURE__ */ new Date("2026-01-25"), status: "present" },
  { date: /* @__PURE__ */ new Date("2026-01-26"), status: "present" },
  { date: /* @__PURE__ */ new Date("2026-01-27"), status: "late" },
  { date: /* @__PURE__ */ new Date("2026-01-28"), status: "present" },
  { date: /* @__PURE__ */ new Date("2026-01-29"), status: "present" },
  { date: /* @__PURE__ */ new Date("2026-01-30"), status: "absent" },
  { date: /* @__PURE__ */ new Date("2026-01-31"), status: "present" }
];
export const mockCareers = [
  {
    id: "car1",
    title: "Software Developer",
    icon: "\u{1F4BB}",
    description: "Design, develop and maintain software applications and systems",
    stream: "Technology",
    requiredSubjects: ["Computer Science", "Mathematics", "Physics"],
    skills: ["Programming", "Problem Solving", "Logical Thinking", "Data Structures", "Algorithms"],
    salaryRange: "\u20B96-15 LPA",
    demand: "High",
    educationPath: [
      "Class 12 - PCM with Computer Science",
      "B.Tech/B.E. in Computer Science",
      "Internships and Projects",
      "Job or Higher Studies (M.Tech/MS)"
    ],
    entranceExams: ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE"],
    relatedCourses: ["Data Science", "Web Development", "Mobile App Development", "Cloud Computing"]
  },
  {
    id: "car2",
    title: "MBBS Doctor",
    icon: "\u{1FA7A}",
    description: "Diagnose and treat patients, perform medical procedures",
    stream: "Science",
    requiredSubjects: ["Biology", "Chemistry", "Physics"],
    skills: ["Medical Knowledge", "Patient Care", "Critical Thinking", "Communication", "Empathy"],
    salaryRange: "\u20B910-25 LPA",
    demand: "High",
    educationPath: [
      "Class 12 - PCB (Physics, Chemistry, Biology)",
      "NEET Exam Qualification",
      "MBBS (5.5 years including internship)",
      "MD/MS Specialization (Optional)"
    ],
    entranceExams: ["NEET UG", "AIIMS", "JIPMER"],
    relatedCourses: ["BDS", "BAMS", "BHMS", "Nursing", "Pharmacy"]
  },
  {
    id: "car3",
    title: "Chartered Accountant",
    icon: "\u{1F4BC}",
    description: "Manage financial records, auditing, taxation and advisory",
    stream: "Commerce",
    requiredSubjects: ["Accountancy", "Business Studies", "Economics"],
    skills: ["Accounting", "Financial Analysis", "Taxation", "Audit", "Attention to Detail"],
    salaryRange: "\u20B98-20 LPA",
    demand: "High",
    educationPath: [
      "Class 12 - Commerce Stream",
      "CA Foundation",
      "CA Intermediate",
      "Articleship (3 years)",
      "CA Final"
    ],
    entranceExams: ["CA Foundation Exam"],
    relatedCourses: ["CMA", "CS", "CFA", "B.Com"]
  },
  {
    id: "car4",
    title: "Civil Engineer",
    icon: "\u{1F3D7}\uFE0F",
    description: "Design and supervise construction of infrastructure projects",
    stream: "Science",
    requiredSubjects: ["Mathematics", "Physics", "Chemistry"],
    skills: ["Engineering Design", "Project Management", "AutoCAD", "Problem Solving"],
    salaryRange: "\u20B95-12 LPA",
    demand: "Medium",
    educationPath: [
      "Class 12 - PCM",
      "B.Tech in Civil Engineering",
      "Site Training/Internships",
      "Government Job or Private Sector"
    ],
    entranceExams: ["JEE Main", "JEE Advanced", "State Engineering Exams"],
    relatedCourses: ["Structural Engineering", "Transportation", "Environmental Engineering"]
  },
  {
    id: "car5",
    title: "Data Scientist",
    icon: "\u{1F4CA}",
    description: "Analyze complex data to help companies make better decisions",
    stream: "Technology",
    requiredSubjects: ["Mathematics", "Statistics", "Computer Science"],
    skills: ["Python/R", "Machine Learning", "Statistics", "Data Visualization", "SQL"],
    salaryRange: "\u20B98-20 LPA",
    demand: "High",
    educationPath: [
      "Class 12 - PCM with CS",
      "B.Tech/B.Sc in CS/Statistics/Math",
      "Learn ML, Python, Statistics",
      "M.Sc./M.Tech in Data Science (Optional)"
    ],
    entranceExams: ["JEE Main", "University Entrance Tests"],
    relatedCourses: ["AI/ML", "Big Data Analytics", "Business Analytics", "Statistics"]
  },
  {
    id: "car6",
    title: "Graphic Designer",
    icon: "\u{1F3A8}",
    description: "Create visual content for brands, websites, and marketing",
    stream: "Design",
    requiredSubjects: ["Fine Arts", "Computer Science", "Any stream acceptable"],
    skills: ["Adobe Creative Suite", "Creativity", "Typography", "Color Theory", "UI/UX"],
    salaryRange: "\u20B94-10 LPA",
    demand: "Medium",
    educationPath: [
      "Class 12 - Any stream",
      "Bachelor in Fine Arts/Design",
      "Portfolio Development",
      "Freelance or Agency Work"
    ],
    entranceExams: ["NID Entrance", "NIFT", "UCEED", "CEED"],
    relatedCourses: ["Web Design", "Motion Graphics", "Brand Identity", "UI/UX Design"]
  },
  {
    id: "car7",
    title: "Mechanical Engineer",
    icon: "\u2699\uFE0F",
    description: "Design, develop and test mechanical devices and systems",
    stream: "Science",
    requiredSubjects: ["Mathematics", "Physics", "Chemistry"],
    skills: ["CAD", "Thermodynamics", "Manufacturing", "Problem Solving"],
    salaryRange: "\u20B95-14 LPA",
    demand: "Medium",
    educationPath: [
      "Class 12 - PCM",
      "B.Tech in Mechanical Engineering",
      "Internships in Manufacturing",
      "Core Industry or Automobile Sector"
    ],
    entranceExams: ["JEE Main", "JEE Advanced", "BITSAT"],
    relatedCourses: ["Automobile Engineering", "Robotics", "Manufacturing"]
  },
  {
    id: "car8",
    title: "Digital Marketer",
    icon: "\u{1F4F1}",
    description: "Promote products and brands through digital channels",
    stream: "Commerce",
    requiredSubjects: ["Business Studies", "Economics", "Computer Applications"],
    skills: ["SEO", "Social Media", "Content Marketing", "Analytics", "Communication"],
    salaryRange: "\u20B94-12 LPA",
    demand: "High",
    educationPath: [
      "Class 12 - Any stream",
      "BBA/B.Com/Mass Communication",
      "Digital Marketing Certifications",
      "Agency or In-house Marketing"
    ],
    entranceExams: ["University Entrance Tests"],
    relatedCourses: ["Content Writing", "Social Media Management", "Google Analytics", "SEO"]
  },
  {
    id: "car9",
    title: "Architect",
    icon: "\u{1F3DB}\uFE0F",
    description: "Design buildings and oversee construction projects",
    stream: "Design",
    requiredSubjects: ["Mathematics", "Physics", "Fine Arts"],
    skills: ["Architectural Design", "AutoCAD", "Creativity", "3D Modeling", "Project Planning"],
    salaryRange: "\u20B95-15 LPA",
    demand: "Medium",
    educationPath: [
      "Class 12 - PCM or Arts with Math",
      "B.Arch (5 years)",
      "Internship with Architect",
      "Council of Architecture Registration"
    ],
    entranceExams: ["NATA", "JEE Main Paper 2"],
    relatedCourses: ["Interior Design", "Urban Planning", "Landscape Architecture"]
  },
  {
    id: "car10",
    title: "Lawyer",
    icon: "\u2696\uFE0F",
    description: "Provide legal advice and represent clients in court",
    stream: "Arts",
    requiredSubjects: ["Political Science", "History", "English"],
    skills: ["Legal Research", "Communication", "Critical Thinking", "Negotiation", "Writing"],
    salaryRange: "\u20B96-20 LPA",
    demand: "Medium",
    educationPath: [
      "Class 12 - Any stream",
      "BA LLB (5 years) or LLB (3 years after graduation)",
      "Bar Council Enrollment",
      "Practice or Corporate Law"
    ],
    entranceExams: ["CLAT", "AILET", "LSAT India"],
    relatedCourses: ["Corporate Law", "Criminal Law", "Cyber Law", "IPR"]
  },
  {
    id: "car11",
    title: "Psychologist",
    icon: "\u{1F9E0}",
    description: "Study human behavior and provide mental health support",
    stream: "Arts",
    requiredSubjects: ["Psychology", "Biology", "Sociology"],
    skills: ["Counseling", "Empathy", "Analytical Skills", "Communication", "Research"],
    salaryRange: "\u20B95-12 LPA",
    demand: "Medium",
    educationPath: [
      "Class 12 - Any stream (preferably with Psychology)",
      "BA/B.Sc in Psychology",
      "MA/M.Sc in Psychology",
      "M.Phil or Ph.D. for Clinical Practice"
    ],
    entranceExams: ["University Entrance Tests", "NET for research"],
    relatedCourses: ["Clinical Psychology", "Counseling", "Organizational Psychology"]
  },
  {
    id: "car12",
    title: "Business Analyst",
    icon: "\u{1F4C8}",
    description: "Analyze business processes and recommend improvements",
    stream: "Commerce",
    requiredSubjects: ["Business Studies", "Economics", "Mathematics"],
    skills: ["Data Analysis", "Excel", "SQL", "Business Intelligence", "Communication"],
    salaryRange: "\u20B96-15 LPA",
    demand: "High",
    educationPath: [
      "Class 12 - Commerce/Science/Arts",
      "BBA/B.Com/B.Tech",
      "MBA or Business Analytics Course",
      "Corporate Role"
    ],
    entranceExams: ["CAT", "MAT", "XAT for MBA"],
    relatedCourses: ["Business Analytics", "Product Management", "Operations Management"]
  },
  {
    id: "car13",
    title: "Fashion Designer",
    icon: "\u{1F457}",
    description: "Create clothing and accessories designs",
    stream: "Design",
    requiredSubjects: ["Fine Arts", "Fashion Studies", "Textile Science"],
    skills: ["Sketching", "Sewing", "Creativity", "Trend Analysis", "Fabric Knowledge"],
    salaryRange: "\u20B94-12 LPA",
    demand: "Medium",
    educationPath: [
      "Class 12 - Any stream",
      "B.Des/B.Sc in Fashion Design (4 years)",
      "Internship with Designer/Brand",
      "Start Label or Work for Brand"
    ],
    entranceExams: ["NIFT", "NID", "UCEED", "Pearl Academy Entrance"],
    relatedCourses: ["Textile Design", "Accessory Design", "Fashion Merchandising"]
  },
  {
    id: "car14",
    title: "Journalist",
    icon: "\u{1F4F0}",
    description: "Research, write and report news stories",
    stream: "Arts",
    requiredSubjects: ["English", "Political Science", "History"],
    skills: ["Writing", "Research", "Communication", "Ethics", "Current Affairs"],
    salaryRange: "\u20B94-10 LPA",
    demand: "Medium",
    educationPath: [
      "Class 12 - Any stream",
      "BA in Journalism/Mass Communication",
      "Internship with Media House",
      "Print/Digital/Broadcast Journalism"
    ],
    entranceExams: ["University Entrance Tests", "IIMC Entrance"],
    relatedCourses: ["Broadcast Journalism", "Investigative Journalism", "Digital Media"]
  },
  {
    id: "car15",
    title: "Biotechnologist",
    icon: "\u{1F9EC}",
    description: "Use living organisms to develop products and solutions",
    stream: "Science",
    requiredSubjects: ["Biology", "Chemistry", "Mathematics"],
    skills: ["Lab Techniques", "Research", "Genetics", "Biochemistry", "Data Analysis"],
    salaryRange: "\u20B95-12 LPA",
    demand: "Medium",
    educationPath: [
      "Class 12 - PCB/PCM with Biology",
      "B.Tech/B.Sc in Biotechnology",
      "M.Tech/M.Sc for Research",
      "Industry or Research Institution"
    ],
    entranceExams: ["JEE Main", "NEET (for some courses)", "GATE"],
    relatedCourses: ["Genetic Engineering", "Microbiology", "Bioinformatics"]
  }
];
export const mockSubjectCompletions = [
  {
    id: "sub1",
    subject: "Mathematics",
    totalUnits: 18,
    completedUnits: 14,
    percentage: 78,
    nextMilestone: "Chapter 15 Quiz - Feb 10",
    units: [
      { id: "u1", name: "Real Numbers", completed: true, quizScore: 85 },
      { id: "u2", name: "Polynomials", completed: true, quizScore: 90 },
      { id: "u3", name: "Linear Equations (Two Variables)", completed: true, quizScore: 88 },
      { id: "u4", name: "Quadratic Equations", completed: true, quizScore: 92 },
      { id: "u5", name: "Arithmetic Progressions", completed: true, quizScore: 86 },
      { id: "u6", name: "Triangles", completed: true, quizScore: 84 },
      { id: "u7", name: "Coordinate Geometry", completed: true, quizScore: 88 },
      { id: "u8", name: "Trigonometry - Introduction", completed: true, quizScore: 90 },
      { id: "u9", name: "Trigonometry - Applications", completed: true, quizScore: 87 },
      { id: "u10", name: "Circles", completed: true, quizScore: 89 },
      { id: "u11", name: "Constructions", completed: true, quizScore: 85 },
      { id: "u12", name: "Areas Related to Circles", completed: true, quizScore: 91 },
      { id: "u13", name: "Surface Areas and Volumes", completed: true, quizScore: 83 },
      { id: "u14", name: "Statistics", completed: true, quizScore: 88 },
      { id: "u15", name: "Probability", completed: false },
      { id: "u16", name: "Advanced Geometry", completed: false },
      { id: "u17", name: "Revision - Algebra", completed: false },
      { id: "u18", name: "Revision - Geometry", completed: false }
    ]
  },
  {
    id: "sub2",
    subject: "Physics",
    totalUnits: 14,
    completedUnits: 12,
    percentage: 86,
    nextMilestone: "Lab Report Submission - Feb 8",
    units: [
      { id: "p1", name: "Light - Reflection and Refraction", completed: true, quizScore: 88 },
      { id: "p2", name: "Human Eye and Colorful World", completed: true, quizScore: 90 },
      { id: "p3", name: "Electricity", completed: true, quizScore: 92 },
      { id: "p4", name: "Magnetic Effects of Current", completed: true, quizScore: 85 },
      { id: "p5", name: "Sources of Energy", completed: true, quizScore: 87 },
      { id: "p6", name: "Work, Energy and Power", completed: true, quizScore: 89 },
      { id: "p7", name: "Sound", completed: true, quizScore: 86 },
      { id: "p8", name: "Motion", completed: true, quizScore: 91 },
      { id: "p9", name: "Newton's Laws of Motion", completed: true, quizScore: 88 },
      { id: "p10", name: "Gravitation", completed: true, quizScore: 90 },
      { id: "p11", name: "Pressure in Fluids", completed: true, quizScore: 84 },
      { id: "p12", name: "Archimedes Principle", completed: true, quizScore: 87 },
      { id: "p13", name: "Modern Physics - Introduction", completed: false },
      { id: "p14", name: "Numerical Problem Solving", completed: false }
    ]
  },
  {
    id: "sub3",
    subject: "Chemistry",
    totalUnits: 15,
    completedUnits: 11,
    percentage: 73,
    nextMilestone: "Lab Practical - Feb 12",
    units: [
      { id: "c1", name: "Chemical Reactions and Equations", completed: true, quizScore: 85 },
      { id: "c2", name: "Acids, Bases and Salts", completed: true, quizScore: 88 },
      { id: "c3", name: "Metals and Non-Metals", completed: true, quizScore: 90 },
      { id: "c4", name: "Carbon and its Compounds", completed: true, quizScore: 82 },
      { id: "c5", name: "Periodic Classification", completed: true, quizScore: 87 },
      { id: "c6", name: "Chemical Bonding", completed: true, quizScore: 84 },
      { id: "c7", name: "Oxidation and Reduction", completed: true, quizScore: 86 },
      { id: "c8", name: "Organic Chemistry Basics", completed: true, quizScore: 89 },
      { id: "c9", name: "Nomenclature", completed: true, quizScore: 83 },
      { id: "c10", name: "Alkanes, Alkenes, Alkynes", completed: true, quizScore: 88 },
      { id: "c11", name: "Functional Groups", completed: true, quizScore: 85 },
      { id: "c12", name: "Environmental Chemistry", completed: false },
      { id: "c13", name: "Polymers", completed: false },
      { id: "c14", name: "Biomolecules", completed: false },
      { id: "c15", name: "Revision and Practice", completed: false }
    ]
  },
  {
    id: "sub4",
    subject: "English",
    totalUnits: 12,
    completedUnits: 10,
    percentage: 83,
    nextMilestone: "Essay Submission - Feb 9",
    units: [
      { id: "e1", name: "Grammar - Tenses", completed: true },
      { id: "e2", name: "Grammar - Voice", completed: true },
      { id: "e3", name: "Grammar - Reported Speech", completed: true },
      { id: "e4", name: "Writing - Formal Letter", completed: true },
      { id: "e5", name: "Writing - Article Writing", completed: true },
      { id: "e6", name: "Writing - Essay", completed: true },
      { id: "e7", name: "Literature - Prose", completed: true },
      { id: "e8", name: "Literature - Poetry", completed: true },
      { id: "e9", name: "Literature - Drama", completed: true },
      { id: "e10", name: "Comprehension Skills", completed: true },
      { id: "e11", name: "Creative Writing", completed: false },
      { id: "e12", name: "Revision", completed: false }
    ]
  },
  {
    id: "sub5",
    subject: "History",
    totalUnits: 10,
    completedUnits: 8,
    percentage: 80,
    nextMilestone: "Project Submission - Feb 15",
    units: [
      { id: "h1", name: "Nationalism in Europe", completed: true, quizScore: 86 },
      { id: "h2", name: "Nationalism in India", completed: true, quizScore: 90 },
      { id: "h3", name: "Making of Global World", completed: true, quizScore: 84 },
      { id: "h4", name: "Age of Industrialization", completed: true, quizScore: 88 },
      { id: "h5", name: "Print Culture", completed: true, quizScore: 85 },
      { id: "h6", name: "Resources and Development", completed: true, quizScore: 87 },
      { id: "h7", name: "Forest and Wildlife", completed: true, quizScore: 89 },
      { id: "h8", name: "Water Resources", completed: true, quizScore: 86 },
      { id: "h9", name: "Agriculture", completed: false },
      { id: "h10", name: "Minerals and Energy", completed: false }
    ]
  },
  {
    id: "sub6",
    subject: "Geography",
    totalUnits: 10,
    completedUnits: 7,
    percentage: 70,
    nextMilestone: "Map Work - Feb 11",
    units: [
      { id: "g1", name: "Resources and Development", completed: true, quizScore: 82 },
      { id: "g2", name: "Forest and Wildlife", completed: true, quizScore: 85 },
      { id: "g3", name: "Water Resources", completed: true, quizScore: 88 },
      { id: "g4", name: "Agriculture", completed: true, quizScore: 84 },
      { id: "g5", name: "Minerals and Energy Resources", completed: true, quizScore: 86 },
      { id: "g6", name: "Manufacturing Industries", completed: true, quizScore: 83 },
      { id: "g7", name: "Lifelines of National Economy", completed: true, quizScore: 87 },
      { id: "g8", name: "Map Skills", completed: false },
      { id: "g9", name: "Practical Geography", completed: false },
      { id: "g10", name: "Contemporary India", completed: false }
    ]
  }
];
export const mockGrades = [
  { subject: "Mathematics", marks: 88, totalMarks: 100, grade: "A1", remarks: "Excellent performance" },
  { subject: "Physics", marks: 85, totalMarks: 100, grade: "A1", remarks: "Very good" },
  { subject: "Chemistry", marks: 79, totalMarks: 100, grade: "A2", remarks: "Good progress" },
  { subject: "English", marks: 82, totalMarks: 100, grade: "A2", remarks: "Well done" },
  { subject: "History", marks: 86, totalMarks: 100, grade: "A1", remarks: "Outstanding" },
  { subject: "Geography", marks: 80, totalMarks: 100, grade: "A2", remarks: "Good work" }
];
export const mockTickets = [
  {
    id: "TKT-001",
    ticketNumber: "TKT-2026-001",
    title: "Unable to access online learning portal",
    description: 'My son is unable to login to the online learning portal. It shows an error message "Invalid credentials" even though we are using the correct password.',
    category: "Technical",
    priority: "High",
    status: "In Progress",
    createdBy: "parent-001",
    createdByName: "Parent User",
    createdByRole: "Parent",
    assignedTo: "admin-001",
    assignedToName: "Neranjan",
    createdAt: (/* @__PURE__ */ new Date("2026-02-04T09:30:00")).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date("2026-02-05T14:20:00")).toISOString(),
    messages: [
      {
        id: "msg-001-1",
        senderId: "parent-001",
        senderName: "Parent User",
        senderRole: "Parent",
        message: "Unable to access the portal since yesterday. Please help.",
        timestamp: (/* @__PURE__ */ new Date("2026-02-04T09:30:00")).toISOString()
      },
      {
        id: "msg-001-2",
        senderId: "admin-001",
        senderName: "Neranjan",
        senderRole: "Admin",
        message: "Thank you for reaching out. I am looking into this issue. Can you please confirm the student ID you are using?",
        timestamp: (/* @__PURE__ */ new Date("2026-02-04T11:15:00")).toISOString()
      },
      {
        id: "msg-001-3",
        senderId: "parent-001",
        senderName: "Parent User",
        senderRole: "Parent",
        message: "The student ID is STU-2026-0142",
        timestamp: (/* @__PURE__ */ new Date("2026-02-04T11:45:00")).toISOString()
      },
      {
        id: "msg-001-4",
        senderId: "admin-001",
        senderName: "Neranjan",
        senderRole: "Admin",
        message: "I have reset the password. Please check your registered email for the new credentials. The issue should be resolved now.",
        timestamp: (/* @__PURE__ */ new Date("2026-02-05T14:20:00")).toISOString()
      }
    ]
  },
  {
    id: "TKT-002",
    ticketNumber: "TKT-2026-002",
    title: "Fee receipt not generated for February 2026",
    description: "I paid the fees for February 2026 but have not received the receipt yet. Need it urgently for reimbursement.",
    category: "Financial",
    priority: "Medium",
    status: "Resolved",
    createdBy: "parent-001",
    createdByName: "Parent User",
    createdByRole: "Parent",
    assignedTo: "admin-001",
    assignedToName: "Neranjan",
    createdAt: (/* @__PURE__ */ new Date("2026-02-01T10:00:00")).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date("2026-02-02T16:30:00")).toISOString(),
    resolvedAt: (/* @__PURE__ */ new Date("2026-02-02T16:30:00")).toISOString(),
    messages: [
      {
        id: "msg-002-1",
        senderId: "parent-001",
        senderName: "Parent User",
        senderRole: "Parent",
        message: "Paid fees on 28th Jan but no receipt yet.",
        timestamp: (/* @__PURE__ */ new Date("2026-02-01T10:00:00")).toISOString()
      },
      {
        id: "msg-002-2",
        senderId: "admin-001",
        senderName: "Neranjan",
        senderRole: "Admin",
        message: "Let me check the payment records and generate the receipt for you.",
        timestamp: (/* @__PURE__ */ new Date("2026-02-01T14:30:00")).toISOString()
      },
      {
        id: "msg-002-3",
        senderId: "admin-001",
        senderName: "Neranjan",
        senderRole: "Admin",
        message: "Receipt has been generated and sent to your registered email. You can also download it from the Fees section in your dashboard.",
        timestamp: (/* @__PURE__ */ new Date("2026-02-02T16:30:00")).toISOString()
      }
    ]
  },
  {
    id: "TKT-003",
    ticketNumber: "TKT-2026-003",
    title: "Request for additional tutoring in Mathematics",
    description: "My child is struggling with quadratic equations. Can we arrange for additional tutoring sessions?",
    category: "Academic",
    priority: "Medium",
    status: "Open",
    createdBy: "parent-001",
    createdByName: "Parent User",
    createdByRole: "Parent",
    createdAt: (/* @__PURE__ */ new Date("2026-02-06T08:15:00")).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date("2026-02-06T08:15:00")).toISOString(),
    messages: [
      {
        id: "msg-003-1",
        senderId: "parent-001",
        senderName: "Parent User",
        senderRole: "Parent",
        message: "Need extra help with Mathematics, especially quadratic equations. Please advise on tutoring options.",
        timestamp: (/* @__PURE__ */ new Date("2026-02-06T08:15:00")).toISOString()
      }
    ]
  },
  {
    id: "TKT-004",
    ticketNumber: "TKT-2026-004",
    title: "Timetable conflict - Sports and Music overlap",
    description: "There seems to be a scheduling issue where Sports and Music classes are happening at the same time on Thursdays.",
    category: "Administrative",
    priority: "Low",
    status: "Open",
    createdBy: "STU-2026-0142",
    createdByName: "Aarav Kumar",
    createdByRole: "Student",
    createdAt: (/* @__PURE__ */ new Date("2026-02-05T16:45:00")).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date("2026-02-05T16:45:00")).toISOString(),
    messages: [
      {
        id: "msg-004-1",
        senderId: "STU-2026-0142",
        senderName: "Aarav Kumar",
        senderRole: "Student",
        message: "Both Sports and Music are scheduled at 2 PM on Thursday. Cannot attend both.",
        timestamp: (/* @__PURE__ */ new Date("2026-02-05T16:45:00")).toISOString()
      }
    ]
  },
  {
    id: "TKT-005",
    ticketNumber: "TKT-2026-005",
    title: "Request for transfer certificate",
    description: "We are relocating to Bangalore. Need TC and other documents for admission to new school.",
    category: "Administrative",
    priority: "High",
    status: "In Progress",
    createdBy: "parent-002",
    createdByName: "Sunita Patel",
    createdByRole: "Parent",
    assignedTo: "admin-001",
    assignedToName: "Neranjan",
    createdAt: (/* @__PURE__ */ new Date("2026-02-03T11:20:00")).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date("2026-02-04T09:30:00")).toISOString(),
    messages: [
      {
        id: "msg-005-1",
        senderId: "parent-002",
        senderName: "Sunita Patel",
        senderRole: "Parent",
        message: "Relocating to Bangalore. Need TC and character certificate urgently.",
        timestamp: (/* @__PURE__ */ new Date("2026-02-03T11:20:00")).toISOString()
      },
      {
        id: "msg-005-2",
        senderId: "admin-001",
        senderName: "Neranjan",
        senderRole: "Admin",
        message: "Processing your request. Please submit the TC application form and clear any pending dues. Documents will be ready in 2-3 working days.",
        timestamp: (/* @__PURE__ */ new Date("2026-02-04T09:30:00")).toISOString()
      }
    ]
  },
  {
    id: "TKT-006",
    ticketNumber: "TKT-2026-006",
    title: "Laboratory equipment malfunction",
    description: "The microscopes in Biology lab are not working properly. This is affecting practical sessions.",
    category: "Technical",
    priority: "Medium",
    status: "Open",
    createdBy: "T007",
    createdByName: "Mrs. Kavita Reddy",
    createdByRole: "Teacher",
    createdAt: (/* @__PURE__ */ new Date("2026-02-05T10:30:00")).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date("2026-02-05T10:30:00")).toISOString(),
    messages: [
      {
        id: "msg-006-1",
        senderId: "T007",
        senderName: "Mrs. Kavita Reddy",
        senderRole: "Teacher",
        message: "3 out of 5 microscopes are not working. Students cannot complete their practical work.",
        timestamp: (/* @__PURE__ */ new Date("2026-02-05T10:30:00")).toISOString()
      }
    ]
  },
  {
    id: "TKT-007",
    ticketNumber: "TKT-2026-007",
    title: "Grade correction request for Physics exam",
    description: "I believe there was an error in my Physics exam grading. The total does not match the marks on individual sections.",
    category: "Academic",
    priority: "Medium",
    status: "Resolved",
    createdBy: "STU-2026-0142",
    createdByName: "Aarav Kumar",
    createdByRole: "Student",
    assignedTo: "admin-001",
    assignedToName: "Neranjan",
    createdAt: (/* @__PURE__ */ new Date("2026-01-28T14:20:00")).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date("2026-01-30T11:15:00")).toISOString(),
    resolvedAt: (/* @__PURE__ */ new Date("2026-01-30T11:15:00")).toISOString(),
    messages: [
      {
        id: "msg-007-1",
        senderId: "STU-2026-0142",
        senderName: "Aarav Kumar",
        senderRole: "Student",
        message: "My section-wise marks add up to 87 but the total shown is 82. Please verify.",
        timestamp: (/* @__PURE__ */ new Date("2026-01-28T14:20:00")).toISOString()
      },
      {
        id: "msg-007-2",
        senderId: "admin-001",
        senderName: "Neranjan",
        senderRole: "Admin",
        message: "I will coordinate with the Physics teacher to review your answer sheet.",
        timestamp: (/* @__PURE__ */ new Date("2026-01-29T10:00:00")).toISOString()
      },
      {
        id: "msg-007-3",
        senderId: "admin-001",
        senderName: "Neranjan",
        senderRole: "Admin",
        message: "You were right. There was a calculation error. Your corrected marks (87) have been updated in the system.",
        timestamp: (/* @__PURE__ */ new Date("2026-01-30T11:15:00")).toISOString()
      }
    ]
  },
  {
    id: "TKT-008",
    ticketNumber: "TKT-2026-008",
    title: "Bus route change request",
    description: "We have moved to a new address. Need to change the school bus route and pickup point.",
    category: "Administrative",
    priority: "High",
    status: "In Progress",
    createdBy: "parent-003",
    createdByName: "Deepak Sharma",
    createdByRole: "Parent",
    assignedTo: "admin-001",
    assignedToName: "Neranjan",
    createdAt: (/* @__PURE__ */ new Date("2026-02-02T09:00:00")).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date("2026-02-03T15:45:00")).toISOString(),
    messages: [
      {
        id: "msg-008-1",
        senderId: "parent-003",
        senderName: "Deepak Sharma",
        senderRole: "Parent",
        message: "Moved to Sector 18. Current bus route doesn't cover this area. Need alternative.",
        timestamp: (/* @__PURE__ */ new Date("2026-02-02T09:00:00")).toISOString()
      },
      {
        id: "msg-008-2",
        senderId: "admin-001",
        senderName: "Neranjan",
        senderRole: "Admin",
        message: "Checking available bus routes covering Sector 18. Will update you with options by tomorrow.",
        timestamp: (/* @__PURE__ */ new Date("2026-02-03T15:45:00")).toISOString()
      }
    ]
  }
];
export const adminCredentials = {
  email: "admin@school.edu.in",
  password: "admin123"
};
export const mockDoubts = [
  {
    id: "D001",
    studentId: "STU-2026-0142",
    studentName: "Aarav Kumar",
    subject: "Mathematics",
    title: "Clarification on Quadratic Equations",
    question: "I am having difficulty understanding the discriminant method for solving quadratic equations. Can you please explain when to use the formula method vs factorization?",
    timestamp: (/* @__PURE__ */ new Date("2026-02-05T10:30:00")).toISOString(),
    status: "Answered",
    priority: "Medium",
    replies: [
      {
        id: "r-001-1",
        userId: "T003",
        userName: "Mrs. Anjali Gupta",
        userRole: "Math Teacher",
        message: "Great question! The discriminant (b\xB2-4ac) helps us decide the best method. If the discriminant is a perfect square, factorization works well. Otherwise, the quadratic formula is more reliable. For your homework, try both methods and see which is easier for each problem.",
        timestamp: (/* @__PURE__ */ new Date("2026-02-05T14:20:00")).toISOString()
      }
    ]
  },
  {
    id: "D002",
    studentId: "STU-2026-0142",
    studentName: "Aarav Kumar",
    subject: "Physics",
    title: "Newton's Third Law Application",
    question: "In the example where a person pushes a wall, why doesn't the wall move if the forces are equal and opposite?",
    timestamp: (/* @__PURE__ */ new Date("2026-02-04T15:45:00")).toISOString(),
    status: "Answered",
    priority: "High",
    replies: [
      {
        id: "r-002-1",
        userId: "T002",
        userName: "Mr. Rajesh Koothrappali",
        userRole: "Physics Teacher",
        message: "Excellent observation! The key is that equal and opposite forces act on DIFFERENT objects. The person pushes the wall, and the wall pushes back on the person with equal force. The wall doesn't move because the force of friction between the wall and ground is much greater than the pushing force. The mass of the wall (connected to the building/ground) is also much larger, so acceleration is negligible.",
        timestamp: (/* @__PURE__ */ new Date("2026-02-04T16:30:00")).toISOString()
      }
    ]
  },
  {
    id: "D003",
    studentId: "STU-2026-0142",
    studentName: "Aarav Kumar",
    subject: "English",
    title: "Difference between Metaphor and Simile",
    question: "Can you explain the difference with examples from the current chapter?",
    timestamp: (/* @__PURE__ */ new Date("2026-02-06T09:15:00")).toISOString(),
    status: "Open",
    priority: "Low",
    replies: []
  },
  {
    id: "D004",
    studentId: "STU-2026-0142",
    studentName: "Aarav Kumar",
    subject: "Mathematics",
    title: "Integration by Parts",
    question: "I don't understand when to choose u and dv in integration by parts. Is there a standard method?",
    timestamp: (/* @__PURE__ */ new Date("2026-02-06T08:00:00")).toISOString(),
    status: "Open",
    priority: "High",
    replies: []
  },
  {
    id: "D005",
    studentId: "STU-2026-0142",
    studentName: "Aarav Kumar",
    subject: "Physics",
    title: "Electric Field vs Electric Potential",
    question: "What is the relationship between electric field and electric potential? How are they different?",
    timestamp: (/* @__PURE__ */ new Date("2026-02-03T11:20:00")).toISOString(),
    status: "Resolved",
    priority: "Medium",
    replies: [
      {
        id: "r-005-1",
        userId: "T002",
        userName: "Mr. Rajesh Koothrappali",
        userRole: "Physics Teacher",
        message: "Electric field is a vector quantity that represents force per unit charge, while electric potential is a scalar quantity representing energy per unit charge. The relationship is: E = -dV/dx (electric field is the negative gradient of potential). Think of it like a hill - potential is the height, and field is the slope.",
        timestamp: (/* @__PURE__ */ new Date("2026-02-03T15:45:00")).toISOString()
      },
      {
        id: "r-005-2",
        userId: "STU-2026-0142",
        userName: "Aarav Kumar",
        userRole: "Student",
        message: "That analogy really helped! Thank you!",
        timestamp: (/* @__PURE__ */ new Date("2026-02-03T16:00:00")).toISOString()
      }
    ]
  },
  {
    id: "D006",
    studentId: "STU-2026-0142",
    studentName: "Aarav Kumar",
    subject: "Chemistry",
    title: "Chemical Bonding Types",
    question: "How do I determine if a compound will form ionic or covalent bonds?",
    timestamp: (/* @__PURE__ */ new Date("2026-02-02T13:30:00")).toISOString(),
    status: "Answered",
    priority: "Medium",
    replies: [
      {
        id: "r-006-1",
        userId: "T007",
        userName: "Mrs. Kavita Reddy",
        userRole: "Science Teacher",
        message: "Great question! The key is electronegativity difference. If the difference is greater than 1.7, it forms an ionic bond. If less than 1.7, it forms a covalent bond. Metals with non-metals usually form ionic bonds, while non-metals with non-metals form covalent bonds.",
        timestamp: (/* @__PURE__ */ new Date("2026-02-02T15:45:00")).toISOString()
      }
    ]
  }
];
