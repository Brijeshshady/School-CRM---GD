require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const healthRoutes = require('./routes/healthRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const classRoutes = require('./routes/classRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const doubtRoutes = require('./routes/doubtRoutes');
const chatRoutes = require('./routes/chatRoutes');
const parentDashboardRoutes = require('./routes/parentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const examGradeRoutes = require('./routes/examGradeRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const quizRoutes = require('./routes/quizRoutes');
const leadRoutes = require('./routes/leadRoutes');
const financeRoutes = require('./routes/financeRoutes');
const auxiliaryRoutes = require('./routes/auxiliaryRoutes');
const hrRoutes = require('./routes/hrRoutes');
const visitorRoutes = require('./routes/visitorRoutes');



// Load Models (Pre-register for population)
require('./models/User');
require('./models/Student');
require('./models/Teacher');
require('./models/Parent');
require('./models/Class');
require('./models/Subject');
require('./models/Assignment');
require('./models/Attendance');
require('./models/Grade');
require('./models/Ticket');
require('./models/Doubt');
require('./models/Conversation');
require('./models/Message');
require('./models/Notification');
require('./models/ExamType');
require('./models/ExamGrade');
require('./models/ReportCard');
require('./models/LeaveRequest');
require('./models/Quiz');
require('./models/Question');
require('./models/QuizAttempt');
require('./models/Substitution');
require('./models/Lead');
require('./models/Expense');
require('./models/LibraryItem');
require('./models/HostelRoom');
require('./models/VehicleRoute');
require('./models/StaffPayroll');
require('./models/Visitor');


// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173"
  ],
  credentials: true
})); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 


// Basic route for root
app.get('/', (req, res) => {
  res.send('School CRM API is running...');
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/parents', parentDashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/exam-grades', examGradeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/auxiliary', auxiliaryRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/visitors', visitorRoutes);



// Error Handling Middleware (must be after routes)
app.use(errorHandler);

const http = require('http');
const { initSocket } = require('./sockets/socketManager');

// Define port
const PORT = process.env.PORT || 5000;

// Create HTTP server wrapper for Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
