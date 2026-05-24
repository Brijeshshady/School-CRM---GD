import * as XLSX from 'xlsx';

export const calculatePercentage = (obtained, max) => {
  if (!max || max <= 0) return 0;
  return parseFloat(((obtained / max) * 100).toFixed(2));
};

export const getLetterGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  if (percentage >= 40) return 'E';
  return 'F';
};

export const getGPA = (percentage) => {
  if (percentage >= 90) return 4.0;
  if (percentage >= 80) return 3.5;
  if (percentage >= 70) return 3.0;
  if (percentage >= 60) return 2.5;
  if (percentage >= 50) return 2.0;
  if (percentage >= 40) return 1.5;
  return 0.0;
};

// Generates and downloads a standardized Excel marks import template
export const downloadExcelTemplate = (className = 'Class', subjectName = 'Subject', examType = 'Exam', roster = []) => {
  const wb = XLSX.utils.book_new();
  
  // Headers row
  const headers = [
    "rollNumber",
    "studentName",
    "theory",
    "practical",
    "assignment",
    "attendance",
    "viva",
    "theoryMax",
    "practicalMax",
    "assignmentMax",
    "attendanceMax",
    "vivaMax",
    "remarks"
  ];
  
  // Create rows using student roster
  const rows = roster.map(student => [
    student.rollNumber || "",
    student.user?.name || student.name || "",
    "", // theory obtained
    "", // practical obtained
    "", // assignment obtained
    "", // attendance obtained
    "", // viva obtained
    "100", // theory max default
    "0",   // practical max default
    "0",   // assignment max default
    "0",   // attendance max default
    "0",   // viva max default
    ""     // remarks
  ]);

  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Set sheet formatting/column widths for elegance
  ws['!cols'] = [
    { wch: 12 }, // rollNumber
    { wch: 25 }, // studentName
    { wch: 10 }, // theory
    { wch: 10 }, // practical
    { wch: 12 }, // assignment
    { wch: 12 }, // attendance
    { wch: 10 }, // viva
    { wch: 10 }, // theoryMax
    { wch: 12 }, // practicalMax
    { wch: 15 }, // assignmentMax
    { wch: 15 }, // attendanceMax
    { wch: 10 }, // vivaMax
    { wch: 30 }  // remarks
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Marks Sheet");
  
  const filename = `Marks_Template_${className.replace(/\s+/g, '_')}_${subjectName.replace(/\s+/g, '_')}_${examType.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(wb, filename);
};

// Parses uploaded Excel file into JSON gradebook records
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        resolve(json);
      } catch (err) {
        reject(new Error('Failed to read Excel workbook: ' + err.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('FileReader error occurred'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
