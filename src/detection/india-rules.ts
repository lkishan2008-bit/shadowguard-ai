export interface DetectionResult {
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  match: string;
  start: number;
  end: number;
}

const PATTERNS = {
  AWS_KEY: /\b(AKIA|ASIA)[0-9A-Z]{16}\b/g,
  AADHAAR: /\b[2-9]\d{3}\s?\d{4}\s?\d{4}\b/g,
  PAN: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g,
  GSTIN: /\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/g,
  INDIAN_PHONE: /\b(?:\+91[\-\s]?)?[6-9]\d{9}\b/g,
  EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
};

export function detectSensitiveData(text: string): DetectionResult[] {
  const results: DetectionResult[] = [];

  const check = (
    pattern: RegExp,
    category: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  ) => {
    let match;
    const regex = new RegExp(pattern);
    while ((match = regex.exec(text)) !== null) {
      results.push({
        category,
        severity,
        match: match[0],
        start: match.index,
        end: match.index + match[0].length,
      });
    }
  };

  check(PATTERNS.AWS_KEY, 'AWS_ACCESS_KEY', 'CRITICAL');
  check(PATTERNS.AADHAAR, 'AADHAAR_NUMBER', 'HIGH');
  check(PATTERNS.PAN, 'PAN_NUMBER', 'HIGH');
  check(PATTERNS.GSTIN, 'GSTIN', 'MEDIUM');
  check(PATTERNS.INDIAN_PHONE, 'PHONE_NUMBER', 'MEDIUM');
  check(PATTERNS.EMAIL, 'EMAIL_ADDRESS', 'LOW');

  return results;
}
