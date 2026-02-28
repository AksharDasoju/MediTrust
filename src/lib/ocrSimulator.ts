import { BillData } from "./mockData";

// Simulates OCR data extraction from uploaded bill images
// In a real system, this would use Tesseract.js or a cloud OCR API

const SAMPLE_EXTRACTIONS: BillData[] = [
  {
    patientName: "Ananya Sharma",
    hospitalName: "Fortis Healthcare",
    date: "2025-01-08",
    amount: 32500,
    invoiceNumber: "FRT-2025-01234",
    gstin: "27AABCF5678G1ZQ",
    items: [
      { description: "Consultation - Orthopedics", amount: 2000 },
      { description: "X-Ray Knee", amount: 1500 },
      { description: "MRI Knee", amount: 8000 },
      { description: "Medicine - Prescribed", amount: 6000 },
      { description: "Physiotherapy Session x3", amount: 15000 },
    ],
    diagnosis: "Knee Ligament Injury",
  },
  {
    patientName: "Mohammed Irfan",
    hospitalName: "Max Super Speciality Hospital",
    date: "2025-01-05",
    amount: 145000,
    invoiceNumber: "MAX-2025-05678",
    gstin: "07AABCM9012H1ZR",
    items: [
      { description: "ICU Per Day x3", amount: 75000 },
      { description: "Consultation - Cardiology", amount: 2500 },
      { description: "ECG", amount: 800 },
      { description: "Echocardiography", amount: 4000 },
      { description: "Blood Tests Panel", amount: 5200 },
      { description: "Medicine - IV + Oral", amount: 42500 },
      { description: "Room Charges x2", amount: 15000 },
    ],
    diagnosis: "Acute Myocardial Infarction",
  },
  {
    patientName: "Sunita Devi",
    hospitalName: "Unknown Nursing Home",
    date: "2025-02-15",
    amount: 450000,
    invoiceNumber: "UNH99999",
    gstin: "XXXXX",
    items: [
      { description: "Surgery - Unspecified", amount: 300000 },
      { description: "Room Charges", amount: 100000 },
      { description: "Medicine", amount: 50000 },
    ],
    diagnosis: "Unspecified",
  },
  {
    patientName: "Kavitha Reddy",
    hospitalName: "Apollo Hospital",
    date: "2025-01-12",
    amount: 8500,
    invoiceNumber: "APL-2025-00912",
    gstin: "33AABCA1234F1ZP",
    items: [
      { description: "Consultation - General Medicine", amount: 1500 },
      { description: "Blood Test - CBC", amount: 500 },
      { description: "Blood Test - Thyroid Panel", amount: 1200 },
      { description: "Ultrasound Abdomen", amount: 2800 },
      { description: "Medicine - Prescribed", amount: 2500 },
    ],
    diagnosis: "Routine Health Screening",
  },
];

export interface OCRResult {
  success: boolean;
  data: BillData | null;
  confidence: number;
  extractionTime: number;
  warnings: string[];
}

export function simulateOCR(file: File): Promise<OCRResult> {
  return new Promise((resolve) => {
    const processingTime = 800 + Math.random() * 1500;

    setTimeout(() => {
      // Validate file
      const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        resolve({
          success: false,
          data: null,
          confidence: 0,
          extractionTime: processingTime,
          warnings: [`Unsupported file format: ${file.type}. Please upload JPG, PNG, or PDF.`],
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        resolve({
          success: false,
          data: null,
          confidence: 0,
          extractionTime: processingTime,
          warnings: ["File size exceeds 10MB limit."],
        });
        return;
      }

      if (file.size < 1024) {
        resolve({
          success: false,
          data: null,
          confidence: 0,
          extractionTime: processingTime,
          warnings: ["File appears to be too small or corrupted. Please upload a valid bill image."],
        });
        return;
      }

      // Simulate extraction based on file characteristics
      const randomIndex = Math.floor(Math.random() * SAMPLE_EXTRACTIONS.length);
      const extracted = { ...SAMPLE_EXTRACTIONS[randomIndex] };

      // Add some randomness to make it feel real
      const confidence = 75 + Math.random() * 20;
      const warnings: string[] = [];

      if (confidence < 85) {
        warnings.push("Some fields may have low confidence due to image quality.");
      }

      resolve({
        success: true,
        data: extracted,
        confidence: Math.round(confidence),
        extractionTime: processingTime,
        warnings,
      });
    }, processingTime);
  });
}

// Sanitize extracted data
export function sanitizeBillData(data: BillData): BillData {
  return {
    patientName: data.patientName?.replace(/[<>{}]/g, "").trim().substring(0, 100) || "Unknown",
    hospitalName: data.hospitalName?.replace(/[<>{}]/g, "").trim().substring(0, 200) || "Unknown",
    date: data.date?.trim().substring(0, 10) || "",
    amount: Math.max(0, Math.min(data.amount || 0, 100000000)),
    invoiceNumber: data.invoiceNumber?.replace(/[<>{}]/g, "").trim().substring(0, 50) || "",
    gstin: data.gstin?.replace(/[^A-Z0-9]/gi, "").trim().substring(0, 15) || undefined,
    items: (data.items || []).map((item) => ({
      description: item.description?.replace(/[<>{}]/g, "").trim().substring(0, 200) || "",
      amount: Math.max(0, Math.min(item.amount || 0, 10000000)),
    })),
    diagnosis: data.diagnosis?.replace(/[<>{}]/g, "").trim().substring(0, 500) || undefined,
  };
}
