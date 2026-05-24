import { createContext, useContext, useState } from "react";
const AppContext = createContext(void 0);
const generateMockStudents = () => [
  {
    id: "1",
    rollNo: "1001",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 555-0101",
    class: "Grade 10",
    section: "A",
    parentName: "Michael Smith",
    parentEmail: "michael@email.com",
    parentPhone: "+1 555-0201",
    address: "123 Oak Street, New York, NY 10001",
    dateOfBirth: "2008-05-15",
    admissionDate: "2023-08-01",
    bloodGroup: "O+",
    status: "active"
  },
  {
    id: "2",
    rollNo: "1002",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 555-0102",
    class: "Grade 9",
    section: "B",
    parentName: "Emily Johnson",
    parentEmail: "emily@email.com",
    parentPhone: "+1 555-0202",
    address: "456 Maple Avenue, Brooklyn, NY 11201",
    dateOfBirth: "2009-08-22",
    admissionDate: "2023-08-01",
    bloodGroup: "A+",
    status: "active"
  },
  {
    id: "3",
    rollNo: "1003",
    name: "David Lee",
    email: "david.lee@email.com",
    phone: "+1 555-0103",
    class: "Grade 11",
    section: "C",
    parentName: "Lisa Lee",
    parentEmail: "lisa@email.com",
    parentPhone: "+1 555-0203",
    address: "789 Pine Road, Queens, NY 11354",
    dateOfBirth: "2007-11-30",
    admissionDate: "2023-08-01",
    bloodGroup: "B+",
    status: "active"
  },
  {
    id: "4",
    rollNo: "1004",
    name: "Emma Davis",
    email: "emma.davis@email.com",
    phone: "+1 555-0104",
    class: "Grade 8",
    section: "A",
    parentName: "Robert Davis",
    parentEmail: "robert@email.com",
    parentPhone: "+1 555-0204",
    address: "321 Cedar Lane, Manhattan, NY 10002",
    dateOfBirth: "2010-03-12",
    admissionDate: "2023-08-01",
    bloodGroup: "AB+",
    status: "active"
  },
  {
    id: "5",
    rollNo: "1005",
    name: "Alex Wilson",
    email: "alex.wilson@email.com",
    phone: "+1 555-0105",
    class: "Grade 12",
    section: "B",
    parentName: "Jennifer Wilson",
    parentEmail: "jennifer@email.com",
    parentPhone: "+1 555-0205",
    address: "654 Birch Street, Bronx, NY 10451",
    dateOfBirth: "2006-09-25",
    admissionDate: "2023-08-01",
    bloodGroup: "O+",
    status: "active"
  }
];
const generateMockLeads = () => [
  {
    id: "1",
    studentName: "Oliver Martinez",
    parentName: "Carlos Martinez",
    email: "carlos@email.com",
    phone: "+1 555-0301",
    grade: "Grade 10",
    source: "Website",
    date: "2024-01-25",
    priority: "high",
    status: "enquiry"
  },
  {
    id: "2",
    studentName: "Sophia Anderson",
    parentName: "Amanda Anderson",
    email: "amanda@email.com",
    phone: "+1 555-0302",
    grade: "Grade 9",
    source: "Referral",
    date: "2024-01-24",
    priority: "medium",
    status: "enquiry"
  },
  {
    id: "3",
    studentName: "Noah Taylor",
    parentName: "Rebecca Taylor",
    email: "rebecca@email.com",
    phone: "+1 555-0303",
    grade: "Grade 11",
    source: "Social Media",
    date: "2024-01-23",
    priority: "high",
    status: "followup"
  },
  {
    id: "4",
    studentName: "Ava Thomas",
    parentName: "Daniel Thomas",
    email: "daniel@email.com",
    phone: "+1 555-0304",
    grade: "Grade 8",
    source: "Walk-in",
    date: "2024-01-22",
    priority: "medium",
    status: "test"
  }
];
const generateMockSchools = () => [
  {
    id: "1",
    name: "Springfield Academy",
    branches: ["Main Campus", "North Branch"],
    totalStudents: 1247,
    totalTeachers: 82,
    status: "active"
  },
  {
    id: "2",
    name: "Riverside International",
    branches: ["Downtown", "East Side"],
    totalStudents: 892,
    totalTeachers: 65,
    status: "active"
  }
];
export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [schools, setSchools] = useState(generateMockSchools());
  const [students, setStudents] = useState(generateMockStudents());
  const [leads, setLeads] = useState(generateMockLeads());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [feeRecords, setFeeRecords] = useState([
    {
      id: "1",
      studentId: "1",
      studentName: "John Smith",
      class: "Grade 10A",
      totalFee: 5e3,
      paid: 5e3,
      pending: 0,
      status: "paid",
      dueDate: "2024-01-15",
      paymentHistory: [
        { id: "1", amount: 5e3, date: "2024-01-10", method: "Credit Card", receiptNo: "RCP-001" }
      ]
    },
    {
      id: "2",
      studentId: "2",
      studentName: "Sarah Johnson",
      class: "Grade 9B",
      totalFee: 5e3,
      paid: 2500,
      pending: 2500,
      status: "partial",
      dueDate: "2024-01-30",
      paymentHistory: [
        { id: "2", amount: 2500, date: "2024-01-05", method: "Bank Transfer", receiptNo: "RCP-002" }
      ]
    }
  ]);
  const [messages, setMessages] = useState([]);
  const login = (email, password, role) => {
    const mockUser = {
      id: "1",
      name: "Neranjan",
      email,
      role,
      schoolId: role !== "super-admin" ? "1" : void 0,
      schoolName: role !== "super-admin" ? "Springfield Academy" : void 0
    };
    setUser(mockUser);
    setIsAuthenticated(true);
  };
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };
  const addSchool = (school) => {
    const newSchool = { ...school, id: Date.now().toString() };
    setSchools([...schools, newSchool]);
  };
  const updateSchool = (id, updates) => {
    setSchools(schools.map((s) => s.id === id ? { ...s, ...updates } : s));
  };
  const deleteSchool = (id) => {
    setSchools(schools.filter((s) => s.id !== id));
  };
  const addStudent = (student) => {
    const newStudent = { ...student, id: Date.now().toString() };
    setStudents([...students, newStudent]);
  };
  const updateStudent = (id, updates) => {
    setStudents(students.map((s) => s.id === id ? { ...s, ...updates } : s));
  };
  const deleteStudent = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };
  const getStudentById = (id) => {
    return students.find((s) => s.id === id);
  };
  const addLead = (lead) => {
    const newLead = { ...lead, id: Date.now().toString() };
    setLeads([...leads, newLead]);
  };
  const updateLead = (id, updates) => {
    setLeads(leads.map((l) => l.id === id ? { ...l, ...updates } : l));
  };
  const deleteLead = (id) => {
    setLeads(leads.filter((l) => l.id !== id));
  };
  const moveLeadStatus = (id, newStatus) => {
    updateLead(id, { status: newStatus });
  };
  const markAttendance = (records) => {
    const newRecords = records.map((r) => ({ ...r, id: `${r.studentId}-${r.date}` }));
    const filteredRecords = attendanceRecords.filter(
      (r) => !(r.date === records[0]?.date && r.class === records[0]?.class)
    );
    setAttendanceRecords([...filteredRecords, ...newRecords]);
  };
  const getAttendanceByDate = (date, className) => {
    return attendanceRecords.filter((r) => r.date === date && r.class === className);
  };
  const addFeeRecord = (record) => {
    const newRecord = { ...record, id: Date.now().toString() };
    setFeeRecords([...feeRecords, newRecord]);
  };
  const updateFeeRecord = (id, updates) => {
    setFeeRecords(feeRecords.map((f) => f.id === id ? { ...f, ...updates } : f));
  };
  const addPayment = (feeRecordId, payment) => {
    const record = feeRecords.find((f) => f.id === feeRecordId);
    if (record) {
      const newPayment = { ...payment, id: Date.now().toString() };
      const newPaid = record.paid + payment.amount;
      const newPending = record.totalFee - newPaid;
      const newStatus = newPending === 0 ? "paid" : newPaid > 0 ? "partial" : new Date(record.dueDate) < /* @__PURE__ */ new Date() ? "overdue" : "pending";
      updateFeeRecord(feeRecordId, {
        paid: newPaid,
        pending: newPending,
        status: newStatus,
        paymentHistory: [...record.paymentHistory, newPayment]
      });
    }
  };
  const sendMessage = (message) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      sentAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "sent"
    };
    setMessages([...messages, newMessage]);
  };
  const deleteMessage = (id) => {
    setMessages(messages.filter((m) => m.id !== id));
  };
  const value = {
    // Auth
    user,
    isAuthenticated,
    login,
    logout,
    // Schools
    schools,
    addSchool,
    updateSchool,
    deleteSchool,
    // Students
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    // Leads
    leads,
    addLead,
    updateLead,
    deleteLead,
    moveLeadStatus,
    // Attendance
    attendanceRecords,
    markAttendance,
    getAttendanceByDate,
    // Fees
    feeRecords,
    addFeeRecord,
    updateFeeRecord,
    addPayment,
    // Communications
    messages,
    sendMessage,
    deleteMessage
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
  const context = useContext(AppContext);
  if (context === void 0) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
