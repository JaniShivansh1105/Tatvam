export const EDUCATION_LEVELS = [
  "School Students",
  "Diploma Students",
  "Undergraduate Students",
  "Postgraduate Students",
  "Competitive Exam Aspirants",
];

export const BOARDS = [
  "CBSE",
  "ICSE",
  "GSEB",
  "Maharashtra Board",
  "Rajasthan Board",
  "State Boards",
  "IB",
  "IGCSE",
  "Diploma Boards",
  "University",
  "Other",
];

export const MEDIUMS = [
  "English",
  "Hindi",
  "Gujarati",
  "Marathi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Bengali",
  "Punjabi",
  "Urdu",
  "Other",
];

export const STREAMS = [
  "Science",
  "Commerce",
  "Arts",
  "General",
  "Engineering",
  "Medical",
  "Other"
];

// Reusable config mapping
export const getClassesForLevelAndBoard = (level: string, board: string) => {
  if (level === "School Students") {
    if (board === "IB" || board === "IGCSE") return ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];
    return ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
  }
  if (level === "Diploma Students") return ["1st Year", "2nd Year", "3rd Year"];
  if (level === "Undergraduate Students") return ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  if (level === "Postgraduate Students") return ["1st Year", "2nd Year"];
  return ["Not Applicable"];
};

export const getSubjectsSuggestion = (stream: string, gradeClass: string) => {
  if (stream === "Science") return ["Physics", "Chemistry", "Mathematics", "Biology", "English", "Computer Science"];
  if (stream === "Commerce") return ["Accountancy", "Economics", "Business Studies", "English", "Mathematics"];
  if (stream === "Arts") return ["History", "Geography", "Political Science", "English", "Sociology"];
  if (stream === "Engineering") return ["Engineering Mathematics", "Data Structures", "Digital Logic", "Operating Systems"];
  return ["English", "Mathematics", "Science", "Social Studies"];
};
