// Test compression and RC4 encryption
const CryptoJS = require('crypto-js');

// Skills mapping for compression
const SKILLS_MAP = {
  "Python/JavaScript Basics": "1",
  "Git & GitHub": "2",
  "REST APIs": "3",
  "HTTP & Web Fundamentals": "4",
  "SQL Basics (PostgreSQL/MySQL)": "5",
  "Node.js & Express.js": "6",
  "CRUD Operations": "7",
  "Authentication (JWT, OAuth)": "8",
  "Data Structures Basics": "9",
  "MongoDB Basics": "10",
  "Algorithms Basics": "11",
  "JSON & Data Formats": "12",
  "Django/Flask (Python)": "13",
  "API Design & Best Practices": "14",
  "Error Handling & Validation": "15",
  "Postman & API Testing": "16",
  "Testing Basics (Jest/Mocha)": "17",
  "Environment Variables & Config": "18",
  "Database Relationships": "19",
  "Middleware & Request Processing": "20",
  "Docker Basics": "21",
  "System Design Fundamentals": "22",
  "GraphQL Basics": "23",
  "Redis & Caching": "24",
  "Linux Command Line": "25",
  "AWS/Cloud Basics": "26",
  "Microservices Basics": "27",
  "API Security Best Practices": "28"
};

// Test data from user
const testData = {
  background: "non-tech",
  currentBackground: "sales-marketing",
  yearsOfExperience: "2-3",
  stepsTaken: "self-learning",
  targetRole: "Backend Engineer",
  targetRoleLabel: "Backend Engineer",
  codeComfort: "beginner",
  currentSkills: ["Python/JavaScript Basics","Git & GitHub","REST APIs","HTTP & Web Fundamentals","SQL Basics (PostgreSQL/MySQL)","Node.js & Express.js","CRUD Operations","Authentication (JWT, OAuth)","Data Structures Basics","MongoDB Basics","Algorithms Basics","JSON & Data Formats","Django/Flask (Python)","API Design & Best Practices","Error Handling & Validation","Postman & API Testing","Testing Basics (Jest/Mocha)","Environment Variables & Config","Database Relationships","Middleware & Request Processing","Docker Basics","System Design Fundamentals","GraphQL Basics","Redis & Caching","Linux Command Line","AWS/Cloud Basics","Microservices Basics","API Security Best Practices"],
  timeline: undefined,
  currentRole: undefined,
  currentRoleLabel: undefined,
  targetCompany: undefined,
  targetCompanyLabel: undefined
};

console.log('Original skills count:', testData.currentSkills.length);
console.log('Original data size (JSON):', JSON.stringify(testData).length, 'characters');

// Compress skills
const compressedSkills = testData.currentSkills.map(skill => SKILLS_MAP[skill] || skill);
console.log('Compressed skills:', compressedSkills);

// Create compact data
const compact = {
  a: testData.background,
  b: testData.currentBackground,
  c: testData.stepsTaken,
  d: testData.targetRole,
  e: testData.targetRoleLabel,
  f: testData.yearsOfExperience,
  g: testData.codeComfort,
  h: compressedSkills,
  i: testData.timeline,
  j: testData.currentRole,
  k: testData.currentRoleLabel,
  l: testData.targetCompany,
  m: testData.targetCompanyLabel
};

// Remove null/undefined
Object.keys(compact).forEach(key => {
  if (compact[key] == null) delete compact[key];
});

console.log('Compact data:', compact);
console.log('Compact JSON size:', JSON.stringify(compact).length, 'characters');

// Test RC4 encryption
const jsonStr = JSON.stringify(compact);
const key = CryptoJS.MD5('sk').toString();
console.log('MD5 key length:', key.length);

const encrypted = CryptoJS.RC4.encrypt(jsonStr, key).toString();
console.log('RC4 encrypted length:', encrypted.length, 'characters');

// Test decryption
const bytes = CryptoJS.RC4.decrypt(encrypted, key);
const decrypted = bytes.toString(CryptoJS.enc.Utf8);
const decryptedData = JSON.parse(decrypted);
console.log('Decryption successful:', JSON.stringify(compact) === decrypted);

// Test full URL length
const baseUrl = 'http://localhost:3000/career-roadmap-tool/admin/roadmap?d=';
const fullUrl = baseUrl + encrypted;
console.log('Full URL length:', fullUrl.length, 'characters');
console.log('Under 150 characters:', fullUrl.length < 150);


