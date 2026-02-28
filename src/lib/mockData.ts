// Verified hospital database for India
export const HOSPITAL_DATABASE: Record<string, { name: string; city: string; gstin: string; accredited: boolean }> = {
  "apollo": { name: "Apollo Hospital", city: "Chennai", gstin: "33AABCA1234F1ZP", accredited: true },
  "fortis": { name: "Fortis Healthcare", city: "Mumbai", gstin: "27AABCF5678G1ZQ", accredited: true },
  "max": { name: "Max Super Speciality Hospital", city: "Delhi", gstin: "07AABCM9012H1ZR", accredited: true },
  "aiims": { name: "AIIMS Delhi", city: "Delhi", gstin: "07AABCA3456I1ZS", accredited: true },
  "medanta": { name: "Medanta - The Medicity", city: "Gurugram", gstin: "06AABCM7890J1ZT", accredited: true },
  "narayana": { name: "Narayana Health", city: "Bangalore", gstin: "29AABCN1234K1ZU", accredited: true },
  "manipal": { name: "Manipal Hospital", city: "Bangalore", gstin: "29AABCM5678L1ZV", accredited: true },
  "kokilaben": { name: "Kokilaben Dhirubhai Ambani Hospital", city: "Mumbai", gstin: "27AABCK9012M1ZW", accredited: true },
  "lilavati": { name: "Lilavati Hospital", city: "Mumbai", gstin: "27AABCL3456N1ZX", accredited: true },
  "hinduja": { name: "P.D. Hinduja Hospital", city: "Mumbai", gstin: "27AABCH7890O1ZY", accredited: true },
  "tata memorial": { name: "Tata Memorial Hospital", city: "Mumbai", gstin: "27AABCT1234P1ZZ", accredited: true },
  "sir ganga ram": { name: "Sir Ganga Ram Hospital", city: "Delhi", gstin: "07AABCS5678Q1ZA", accredited: true },
  "batra": { name: "Batra Hospital", city: "Delhi", gstin: "07AABCB9012R1ZB", accredited: true },
  "sunrise medical center": { name: "Sunrise Medical Center", city: "Hyderabad", gstin: "36AABCS3456S1ZC", accredited: true },
  "city clinic": { name: "City Clinic", city: "Pune", gstin: "27AABCC7890T1ZD", accredited: false },
  "healing touch": { name: "Healing Touch Hospital", city: "Chandigarh", gstin: "04AABCH1234U1ZE", accredited: false },
};

// Standard pricing ranges (INR) for common medical procedures
export const STANDARD_PRICING: Record<string, { min: number; max: number; category: string }> = {
  "consultation": { min: 300, max: 2500, category: "OPD" },
  "blood test": { min: 200, max: 3000, category: "Pathology" },
  "cbc": { min: 200, max: 800, category: "Pathology" },
  "x-ray": { min: 300, max: 2000, category: "Radiology" },
  "mri": { min: 3000, max: 25000, category: "Radiology" },
  "ct scan": { min: 2000, max: 15000, category: "Radiology" },
  "ultrasound": { min: 500, max: 5000, category: "Radiology" },
  "ecg": { min: 200, max: 1500, category: "Cardiology" },
  "echocardiography": { min: 1500, max: 5000, category: "Cardiology" },
  "angioplasty": { min: 100000, max: 500000, category: "Cardiology" },
  "bypass surgery": { min: 200000, max: 800000, category: "Cardiology" },
  "knee replacement": { min: 150000, max: 500000, category: "Orthopedics" },
  "hip replacement": { min: 200000, max: 600000, category: "Orthopedics" },
  "appendectomy": { min: 30000, max: 150000, category: "Surgery" },
  "cesarean": { min: 25000, max: 200000, category: "Obstetrics" },
  "normal delivery": { min: 10000, max: 80000, category: "Obstetrics" },
  "dialysis": { min: 1500, max: 5000, category: "Nephrology" },
  "chemotherapy": { min: 10000, max: 100000, category: "Oncology" },
  "icu per day": { min: 5000, max: 50000, category: "Critical Care" },
  "room charges": { min: 1000, max: 15000, category: "Hospitalization" },
  "medicine": { min: 100, max: 50000, category: "Pharmacy" },
};

// Known fraudulent patterns
export const FRAUD_PATTERNS = {
  suspiciousAmountThresholds: { low: 50000, medium: 200000, high: 500000 },
  duplicateWindowDays: 30,
  maxBillsPerPatientPerMonth: 5,
};

// Demo bill templates
export interface BillData {
  patientName: string;
  hospitalName: string;
  date: string;
  amount: number;
  invoiceNumber: string;
  gstin?: string;
  items?: { description: string; amount: number }[];
  diagnosis?: string;
}

export const DEMO_GENUINE_BILL: BillData = {
  patientName: "Rajesh Kumar",
  hospitalName: "Apollo Hospital",
  date: "2025-01-10",
  amount: 15750,
  invoiceNumber: "APL-2025-00847",
  gstin: "33AABCA1234F1ZP",
  items: [
    { description: "Consultation - General Medicine", amount: 1500 },
    { description: "Blood Test - CBC", amount: 650 },
    { description: "Blood Test - Lipid Profile", amount: 1200 },
    { description: "X-Ray Chest PA", amount: 800 },
    { description: "ECG", amount: 600 },
    { description: "Medicine - Prescribed", amount: 11000 },
  ],
  diagnosis: "Routine Health Checkup",
};

export const DEMO_FAKE_BILL: BillData = {
  patientName: "Vikram Malhotra",
  hospitalName: "Unknown Hospital",
  date: "2025-01-13",
  amount: 875000,
  invoiceNumber: "UNK-2025-99999",
  gstin: "INVALID12345",
  items: [
    { description: "Consultation", amount: 25000 },
    { description: "Blood Test", amount: 50000 },
    { description: "Room Charges (1 day)", amount: 200000 },
    { description: "Surgery - Unspecified", amount: 500000 },
    { description: "Medicine", amount: 100000 },
  ],
  diagnosis: "Unspecified Treatment",
};

// Dashboard mock data
export const DASHBOARD_STATS = {
  totalBills: 1247,
  fraudulent: 89,
  genuine: 1102,
  pendingReview: 56,
};

export const MONTHLY_TRENDS = [
  { month: "Jul", genuine: 120, fraudulent: 8, pending: 5 },
  { month: "Aug", genuine: 145, fraudulent: 12, pending: 8 },
  { month: "Sep", genuine: 160, fraudulent: 15, pending: 7 },
  { month: "Oct", genuine: 170, fraudulent: 10, pending: 9 },
  { month: "Nov", genuine: 185, fraudulent: 18, pending: 6 },
  { month: "Dec", genuine: 165, fraudulent: 14, pending: 11 },
  { month: "Jan", genuine: 157, fraudulent: 12, pending: 10 },
];

export const RECENT_CASES = [
  { id: "CASE-001", hospital: "Sunrise Medical Center", patient: "Priya P.", score: 82, status: "High Risk" as const, date: "2025-01-15" },
  { id: "CASE-002", hospital: "City Clinic", patient: "Ravi K.", score: 55, status: "Medium Risk" as const, date: "2025-01-14" },
  { id: "CASE-003", hospital: "Apollo Hospital", patient: "Neha S.", score: 12, status: "Low Risk" as const, date: "2025-01-14" },
  { id: "CASE-004", hospital: "Unknown Hospital", patient: "Vikram M.", score: 91, status: "High Risk" as const, date: "2025-01-13" },
  { id: "CASE-005", hospital: "Fortis Healthcare", patient: "Anita R.", score: 28, status: "Low Risk" as const, date: "2025-01-12" },
  { id: "CASE-006", hospital: "Healing Touch", patient: "Deepak L.", score: 45, status: "Medium Risk" as const, date: "2025-01-11" },
];
