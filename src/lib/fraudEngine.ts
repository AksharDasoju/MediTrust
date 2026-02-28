import { BillData, HOSPITAL_DATABASE, STANDARD_PRICING, FRAUD_PATTERNS } from "./mockData";

export interface FraudReason {
  rule: string;
  description: string;
  severity: "low" | "medium" | "high";
  points: number;
}

export interface FraudResult {
  fraudScore: number;
  riskLevel: "Low" | "Medium" | "High";
  confidenceScore: number;
  reasons: FraudReason[];
  extractedData: BillData;
  ruleBasedScore: number;
  aiAnomalyScore: number;
  verificationDetails: {
    gstValid: boolean;
    hospitalFound: boolean;
    hospitalAccredited: boolean;
    pricingNormal: boolean;
    dateValid: boolean;
    invoiceFormatValid: boolean;
  };
}

// GST validation (Indian GSTIN format: 2-digit state + 10-char PAN + 1 entity + 1 Z + 1 check)
function validateGSTIN(gstin: string | undefined): boolean {
  if (!gstin) return false;
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin.toUpperCase().trim());
}

// Validate invoice number format
function validateInvoiceFormat(invoiceNumber: string): boolean {
  if (!invoiceNumber || invoiceNumber.trim().length < 5) return false;
  // Check for sequential numbering pattern (not all 9s or obvious fakes)
  if (/9{4,}/.test(invoiceNumber)) return false;
  // Should have alphanumeric pattern with separator
  const hasStructure = /^[A-Z]{2,5}[-/][0-9]{4}[-/][0-9]{3,6}$/.test(invoiceNumber.toUpperCase());
  return hasStructure || invoiceNumber.length >= 8;
}

// Validate date
function validateDate(dateStr: string): { valid: boolean; isFuture: boolean; isTooOld: boolean } {
  const date = new Date(dateStr);
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  return {
    valid: !isNaN(date.getTime()),
    isFuture: date > now,
    isTooOld: date < oneYearAgo,
  };
}

// Check hospital against database
function checkHospital(hospitalName: string): { found: boolean; accredited: boolean; matchedName?: string } {
  const normalized = hospitalName.toLowerCase().trim();
  for (const [key, data] of Object.entries(HOSPITAL_DATABASE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return { found: true, accredited: data.accredited, matchedName: data.name };
    }
  }
  return { found: false, accredited: false };
}

// Check pricing against standard ranges
function checkPricing(items: { description: string; amount: number }[]): { normal: boolean; anomalies: string[] } {
  const anomalies: string[] = [];
  if (!items || items.length === 0) return { normal: true, anomalies };

  for (const item of items) {
    const desc = item.description.toLowerCase();
    for (const [procedure, range] of Object.entries(STANDARD_PRICING)) {
      if (desc.includes(procedure)) {
        if (item.amount > range.max * 3) {
          anomalies.push(`${item.description}: ₹${item.amount.toLocaleString("en-IN")} is ${Math.round(item.amount / range.max)}x above max standard (₹${range.max.toLocaleString("en-IN")})`);
        } else if (item.amount > range.max * 1.5) {
          anomalies.push(`${item.description}: ₹${item.amount.toLocaleString("en-IN")} exceeds typical range (₹${range.min.toLocaleString("en-IN")}–₹${range.max.toLocaleString("en-IN")})`);
        }
        break;
      }
    }
  }

  return { normal: anomalies.length === 0, anomalies };
}

// AI anomaly detection simulation (pattern-based scoring)
function computeAIAnomalyScore(bill: BillData): { score: number; factors: string[] } {
  let score = 0;
  const factors: string[] = [];

  // Amount anomaly
  if (bill.amount > FRAUD_PATTERNS.suspiciousAmountThresholds.high) {
    score += 30;
    factors.push("Extremely high bill amount detected");
  } else if (bill.amount > FRAUD_PATTERNS.suspiciousAmountThresholds.medium) {
    score += 20;
    factors.push("Unusually high billing amount");
  } else if (bill.amount > FRAUD_PATTERNS.suspiciousAmountThresholds.low) {
    score += 10;
    factors.push("Elevated billing amount");
  }

  // Item count anomaly
  if (bill.items && bill.items.length > 10) {
    score += 10;
    factors.push("Unusually high number of line items");
  }

  // Single item dominates total
  if (bill.items && bill.items.length > 0) {
    const maxItem = Math.max(...bill.items.map((i) => i.amount));
    if (maxItem / bill.amount > 0.8) {
      score += 15;
      factors.push("Single line item dominates total bill amount");
    }
  }

  // Vague descriptions
  if (bill.items) {
    const vagueItems = bill.items.filter((i) => {
      const desc = i.description.toLowerCase();
      return desc === "medicine" || desc === "treatment" || desc.includes("unspecified") || desc.includes("misc") || desc.includes("other");
    });
    if (vagueItems.length > 0) {
      score += 15;
      factors.push("Vague or unspecified item descriptions found");
    }
  }

  // Round numbers (suspicious)
  if (bill.items) {
    const roundItems = bill.items.filter((i) => i.amount % 1000 === 0 && i.amount > 5000);
    if (roundItems.length > 2) {
      score += 10;
      factors.push("Multiple suspiciously round amounts detected");
    }
  }

  // Diagnosis check
  if (!bill.diagnosis || bill.diagnosis.toLowerCase().includes("unspecified")) {
    score += 10;
    factors.push("Missing or vague diagnosis");
  }

  return { score: Math.min(score, 50), factors };
}

// Main fraud analysis function
export function analyzeBill(bill: BillData): FraudResult {
  const reasons: FraudReason[] = [];
  let ruleScore = 0;

  // 1. GST Validation
  const gstValid = validateGSTIN(bill.gstin);
  if (!gstValid) {
    const points = bill.gstin ? 20 : 15;
    ruleScore += points;
    reasons.push({
      rule: "GST Validation",
      description: bill.gstin ? `Invalid GST number format: "${bill.gstin}"` : "Missing GST number on bill",
      severity: "high",
      points,
    });
  }

  // 2. Hospital verification
  const hospitalCheck = checkHospital(bill.hospitalName);
  if (!hospitalCheck.found) {
    ruleScore += 20;
    reasons.push({
      rule: "Hospital Verification",
      description: `Hospital "${bill.hospitalName}" not found in verified database`,
      severity: "high",
      points: 20,
    });
  } else if (!hospitalCheck.accredited) {
    ruleScore += 8;
    reasons.push({
      rule: "Hospital Accreditation",
      description: `Hospital "${hospitalCheck.matchedName}" found but not NABH accredited`,
      severity: "medium",
      points: 8,
    });
  }

  // 3. Invoice format
  const invoiceValid = validateInvoiceFormat(bill.invoiceNumber);
  if (!invoiceValid) {
    ruleScore += 10;
    reasons.push({
      rule: "Invoice Format",
      description: `Invoice number "${bill.invoiceNumber}" has suspicious format`,
      severity: "medium",
      points: 10,
    });
  }

  // 4. Date validation
  const dateCheck = validateDate(bill.date);
  if (!dateCheck.valid) {
    ruleScore += 15;
    reasons.push({
      rule: "Date Validation",
      description: "Invalid or missing date on bill",
      severity: "high",
      points: 15,
    });
  } else if (dateCheck.isFuture) {
    ruleScore += 25;
    reasons.push({
      rule: "Date Validation",
      description: "Bill date is in the future — suspicious date mismatch",
      severity: "high",
      points: 25,
    });
  } else if (dateCheck.isTooOld) {
    ruleScore += 5;
    reasons.push({
      rule: "Date Validation",
      description: "Bill is older than 1 year",
      severity: "low",
      points: 5,
    });
  }

  // 5. Pricing validation
  const pricingCheck = checkPricing(bill.items || []);
  if (!pricingCheck.normal) {
    const points = Math.min(pricingCheck.anomalies.length * 8, 25);
    ruleScore += points;
    for (const anomaly of pricingCheck.anomalies) {
      reasons.push({
        rule: "Pricing Analysis",
        description: anomaly,
        severity: pricingCheck.anomalies.length > 2 ? "high" : "medium",
        points: 8,
      });
    }
  }

  // 6. AI anomaly detection
  const aiResult = computeAIAnomalyScore(bill);
  for (const factor of aiResult.factors) {
    reasons.push({
      rule: "AI Pattern Analysis",
      description: factor,
      severity: aiResult.score > 30 ? "high" : aiResult.score > 15 ? "medium" : "low",
      points: Math.round(aiResult.score / Math.max(aiResult.factors.length, 1)),
    });
  }

  // Compute combined score (rule 50% + AI 50%)
  const clampedRuleScore = Math.min(ruleScore, 50);
  const clampedAIScore = Math.min(aiResult.score, 50);
  const fraudScore = Math.min(clampedRuleScore + clampedAIScore, 100);

  // Risk level
  const riskLevel: "Low" | "Medium" | "High" = fraudScore >= 65 ? "High" : fraudScore >= 35 ? "Medium" : "Low";

  // Confidence based on data completeness
  let confidence = 60;
  if (bill.gstin) confidence += 8;
  if (bill.items && bill.items.length > 0) confidence += 10;
  if (bill.diagnosis) confidence += 5;
  if (bill.hospitalName) confidence += 7;
  if (bill.invoiceNumber) confidence += 5;
  if (bill.date) confidence += 5;
  confidence = Math.min(confidence, 98);

  // Sort reasons by severity
  const severityOrder = { high: 0, medium: 1, low: 2 };
  reasons.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    fraudScore,
    riskLevel,
    confidenceScore: confidence,
    reasons,
    extractedData: bill,
    ruleBasedScore: clampedRuleScore,
    aiAnomalyScore: clampedAIScore,
    verificationDetails: {
      gstValid,
      hospitalFound: hospitalCheck.found,
      hospitalAccredited: hospitalCheck.accredited,
      pricingNormal: pricingCheck.normal,
      dateValid: dateCheck.valid && !dateCheck.isFuture,
      invoiceFormatValid: invoiceValid,
    },
  };
}
