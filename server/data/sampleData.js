const { ROLES, ATTENDANCE_STATUS, ASSIGNMENT_STATUS } = require('../constants');

const sampleData = {
  users: [
    // Admin
    { name: 'Admin Office', email: 'admin@school.com', password: 'password123', role: ROLES.ADMIN },
    // Parents
    { name: 'Ravi Kumar', email: 'parent1@school.com', password: 'password123', role: ROLES.PARENT },
    { name: 'Ravi Kumar', email: 'ravi.kumar@example.com', password: 'parent123', role: ROLES.PARENT },
    { name: 'Sunita Patel', email: 'parent2@school.com', password: 'password123', role: ROLES.PARENT },
    // Students
    { name: 'Aarav Kumar', email: 'student1@school.com', password: 'password123', role: ROLES.STUDENT },
    { name: 'Aarav Kumar', email: 'aarav.kumar@school.edu.in', password: 'student123', role: ROLES.STUDENT },
    { name: 'Rohan Patel', email: 'student2@school.com', password: 'password123', role: ROLES.STUDENT },
    // Teachers
    { name: 'Ms. Priya Sharma', email: 'teacher1@school.com', password: 'password123', role: ROLES.TEACHER },
    { name: 'Ms. Priya Sharma', email: 'priya.sharma@school.edu.in', password: 'staff123', role: ROLES.TEACHER },
    { name: 'Mrs. Anjali Gupta', email: 'teacher2@school.com', password: 'password123', role: ROLES.TEACHER },
    { name: 'Mrs. Anjali Gupta', email: 'anjali.gupta@school.edu.in', password: 'password123', role: ROLES.TEACHER },
    { name: 'Mr. Rajesh Koothrappali', email: 'teacher3@school.com', password: 'password123', role: ROLES.TEACHER },
    { name: 'Mr. Rajesh Koothrappali', email: 'rajesh.k@school.edu.in', password: 'password123', role: ROLES.TEACHER },
    { name: 'Mr. Vikram Singh', email: 'teacher4@school.com', password: 'password123', role: ROLES.TEACHER },
    { name: 'Mrs. Kavita Reddy', email: 'teacher5@school.com', password: 'password123', role: ROLES.TEACHER },
    { name: 'Ms. Meera Iyer', email: 'teacher6@school.com', password: 'password123', role: ROLES.TEACHER },
    { name: 'Mr. Rahul Roy', email: 'teacher7@school.com', password: 'password123', role: ROLES.TEACHER }
  ],
  classes: [
    { name: 'Class 10', section: 'A', roomNumber: 'Room 201', academicYear: '2025-2026' },
    { name: 'Class 10', section: 'B', roomNumber: 'Room 202', academicYear: '2025-2026' },
  ],
  subjects: [
    { name: 'Mathematics', code: 'MATH10', department: 'Mathematics', credits: 4, weeklyHours: 5, subjectType: 'Core', description: 'CBSE Class 10 Mathematics' },
    { name: 'Physics', code: 'PHYS10', department: 'Science', credits: 3, weeklyHours: 4, subjectType: 'Core', description: 'CBSE Class 10 Physics' },
    { name: 'Chemistry', code: 'CHEM10', department: 'Science', credits: 3, weeklyHours: 4, subjectType: 'Core', description: 'CBSE Class 10 Chemistry' },
    { name: 'English', code: 'ENGL10', department: 'Languages', credits: 3, weeklyHours: 4, subjectType: 'Core', description: 'CBSE Class 10 English Literature & Grammar' },
    { name: 'History', code: 'HIST10', department: 'Social Sciences', credits: 3, weeklyHours: 3, subjectType: 'Core', description: 'CBSE Class 10 History' },
    { name: 'Geography', code: 'GEOG10', department: 'Social Sciences', credits: 3, weeklyHours: 3, subjectType: 'Core', description: 'CBSE Class 10 Geography' }
  ],
  assignments: [
    { title: 'Quadratic Equations Worksheet', description: 'Solve problems 1-20 from Chapter 4', totalMarks: 50, status: ASSIGNMENT_STATUS.PUBLISHED },
    { title: 'Newton\'s Laws Lab Report', description: 'Submit detailed experiment observations', totalMarks: 50, status: ASSIGNMENT_STATUS.PUBLISHED },
    { title: 'Chemical Bonding Notes', description: 'Prepare detailed notes on ionic and covalent bonds', totalMarks: 30, status: ASSIGNMENT_STATUS.PUBLISHED },
    { title: 'Essay on Climate Change', description: 'Write 500-word essay with references', totalMarks: 40, status: ASSIGNMENT_STATUS.PUBLISHED },
    { title: 'Freedom Struggle Timeline', description: 'Create a comprehensive timeline 1857-1947', totalMarks: 50, status: ASSIGNMENT_STATUS.PUBLISHED },
    { title: 'Sports Day Registration', description: 'Register for athletics events', totalMarks: 10, status: ASSIGNMENT_STATUS.PUBLISHED }
  ],
  tickets: [
    {
      ticketNumber: 'TKT-2026-001',
      title: 'Unable to access online learning portal',
      description: 'My son is unable to login to the online learning portal. It shows an error message "Invalid credentials" even though we are using the correct password.',
      category: 'Technical',
      priority: 'High',
      status: 'In Progress',
      messages: [
        { message: 'Unable to access the portal since yesterday. Please help.', senderRole: ROLES.PARENT, senderName: 'Ravi Kumar' },
        { message: 'Thank you for reaching out. I am looking into this issue. Can you please confirm the student ID you are using?', senderRole: ROLES.ADMIN, senderName: 'Admin Office' },
        { message: 'The student ID is STU-2026-0142', senderRole: ROLES.PARENT, senderName: 'Ravi Kumar' },
        { message: 'I have reset the password. Please check your registered email for the new credentials. The issue should be resolved now.', senderRole: ROLES.ADMIN, senderName: 'Admin Office' }
      ]
    },
    {
      ticketNumber: 'TKT-2026-002',
      title: 'Fee receipt not generated for February 2026',
      description: 'I paid the fees for February 2026 but have not received the receipt yet. Need it urgently for reimbursement.',
      category: 'Financial',
      priority: 'Medium',
      status: 'Resolved',
      messages: [
        { message: 'Paid fees on 28th Jan but no receipt yet.', senderRole: ROLES.PARENT, senderName: 'Ravi Kumar' },
        { message: 'Let me check the payment records and generate the receipt for you.', senderRole: ROLES.ADMIN, senderName: 'Admin Office' },
        { message: 'Receipt has been generated and sent to your registered email. You can also download it from the Fees section in your dashboard.', senderRole: ROLES.ADMIN, senderName: 'Admin Office' }
      ]
    },
    {
      ticketNumber: 'TKT-2026-003',
      title: 'Request for additional tutoring in Mathematics',
      description: 'My child is struggling with quadratic equations. Can we arrange for additional tutoring sessions?',
      category: 'Academic',
      priority: 'Medium',
      status: 'Open',
      messages: [
        { message: 'Need extra help with Mathematics, especially quadratic equations. Please advise on tutoring options.', senderRole: ROLES.PARENT, senderName: 'Ravi Kumar' }
      ]
    }
  ],
  doubts: [
    {
      title: 'Doubt about Quadratic Formula',
      question: 'Why do we use the quadratic formula when we can factor? Is it always applicable?',
      subject: 'Mathematics',
      status: 'Answered',
      priority: 'Medium',
      replies: [
        { userName: 'Aarav Kumar', message: 'I tried factoring x^2 + 5x + 3 = 0 but got stuck. Does factoring only work for integers?', senderRole: ROLES.STUDENT },
        { userName: 'Mrs. Anjali Gupta', message: 'Yes Aarav! Factoring is easy when roots are rational. The quadratic formula works for all quadratic equations, even with irrational/complex roots.', senderRole: ROLES.TEACHER }
      ]
    }
  ],
  announcements: [
    {
      title: 'Annual Sports Day 2026',
      content: 'The Annual Sports Day is scheduled for February 20, 2026. Registrations for track events are now open.',
      category: 'Event',
      targetAudience: 'All',
      priority: 'High'
    },
    {
      title: 'Midterm Report Cards Dispatched',
      content: 'Midterm examination report cards have been published on the portal. Parents are requested to review and confirm sign-offs.',
      category: 'Exam',
      targetAudience: 'Parents',
      priority: 'Medium'
    }
  ],
  examTypes: [
    { name: 'Unit Test 1', code: 'UT1', description: 'First Unit Test of Academic Year' },
    { name: 'Midterm Examination', code: 'MID', description: 'Half Yearly Examination' },
    { name: 'Final Examination', code: 'FINAL', description: 'Annual Board Examination' }
  ],
  fees: [
    { title: 'February 2026 Tuition Fee', amount: 5000, status: 'Paid', dueDate: new Date('2026-02-10') },
    { title: 'March 2026 Tuition Fee', amount: 5000, status: 'Pending', dueDate: new Date('2026-03-10') }
  ]
};

module.exports = sampleData;
