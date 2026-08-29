// src/detection/india-rules.ts

export interface DetectionResult {
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  matchedText: string;
  start: number;
  end: number;
}

export function detectSensitiveData(text: string): DetectionResult[] {
  const results: DetectionResult[] = [];

  const patterns = [
    {
      category: 'AWS_ACCESS_KEY',
      severity: 'CRITICAL' as const,
      regex: /AKIA[0-9A-Z]{16}/g
    },
    {
      category: 'PAN_NUMBER',
      severity: 'HIGH' as const,
      regex: /[A-Z]{5}[0-9]{4}[A-Z]{1}/g
    },
    {
      category: 'PHONE_NUMBER',
      severity: 'MEDIUM' as const,
      regex: /(\+91[\-\s]?)?[6-9]\d{9}/g
    },
    {
      category: 'AADHAAR_NUMBER',
      severity: 'HIGH' as const,
      // Matches 12 digits separated by spaces/dashes (e.g. 1234 5678 9012)
      regex: /\b[2-9]{1}\d{3}[\s\-]?\d{4}[\s\-]?\d{4}\b/g
    },
    {
      category: 'EMAIL_ADDRESS',
      severity: 'LOW' as const,
      regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    }
  ];

  // Track matched ranges to prevent overlap/double-tagging
  const matchedRanges: [number, number][] = [];

  for (const item of patterns) {
    let match: RegExpExecArray | null;
    while ((match = item.regex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      const overlaps = matchedRanges.some(([rStart, rEnd]) => start < rEnd && end > rStart);

      if (!overlaps) {
        matchedRanges.push([start, end]);
        results.push({
          category: item.category,
          severity: item.severity,
          matchedText: match[0],
          start,
          end
        });
      }
    }
  }

  return results.sort((a, b) => a.start - b.start);
}
