import { detectSensitiveData } from '../detection/india-rules';
import type { DetectionResult } from '../detection/india-rules';

export function sanitizePrompt(text: string): {
  sanitizedText: string;
  detections: DetectionResult[];
} {
  const detections = detectSensitiveData(text);
  if (detections.length === 0) return { sanitizedText: text, detections: [] };

  let sanitizedText = text;
  // Sort descending by start index to prevent offset displacement during replacement
  const sortedDetections = [...detections].sort((a, b) => b.start - a.start);

  for (const item of sortedDetections) {
    sanitizedText =
      sanitizedText.substring(0, item.start) +
      `[REDACTED_${item.category}]` +
      sanitizedText.substring(item.end);
  }

  return { sanitizedText, detections };
}
