import type { Severity, PolicyAction, AIServiceName } from '../types';
import type { DetectionResult } from './india-rules';

export interface RiskEvaluation {
  riskScore: number;
  severity: Severity;
  recommendedAction: PolicyAction;
  factors: {
    label: string;
    scoreContribution: number;
    severity: Severity;
  }[];
  summary: string;
}

const CATEGORY_WEIGHTS: Record<string, { weight: number; severity: Severity; defaultAction: PolicyAction }> = {
  AWS_ACCESS_KEY: { weight: 45, severity: 'CRITICAL', defaultAction: 'BLOCK' },
  PRIVATE_KEY: { weight: 50, severity: 'CRITICAL', defaultAction: 'BLOCK' },
  AADHAAR_NUMBER: { weight: 35, severity: 'HIGH', defaultAction: 'REDACT' },
  PAN_NUMBER: { weight: 30, severity: 'HIGH', defaultAction: 'REDACT' },
  CUSTOMER_PII: { weight: 28, severity: 'HIGH', defaultAction: 'REDACT' },
  SOURCE_CODE: { weight: 25, severity: 'HIGH', defaultAction: 'WARN' },
  GSTIN: { weight: 20, severity: 'MEDIUM', defaultAction: 'REDACT' },
  PHONE_NUMBER: { weight: 18, severity: 'MEDIUM', defaultAction: 'WARN' },
  FINANCIAL_DATA: { weight: 22, severity: 'MEDIUM', defaultAction: 'REDACT' },
  EMAIL_ADDRESS: { weight: 10, severity: 'LOW', defaultAction: 'ALLOW' },
};

const SERVICE_RISK_MULTIPLIER: Record<AIServiceName, number> = {
  ChatGPT: 1.15,
  Claude: 1.05,
  Gemini: 1.10,
};

export function evaluateRisk(
  detections: DetectionResult[],
  service: AIServiceName = 'ChatGPT'
): RiskEvaluation {
  if (detections.length === 0) {
    return {
      riskScore: 0,
      severity: 'LOW',
      recommendedAction: 'ALLOW',
      factors: [],
      summary: 'Prompt is clean. No sensitive credentials or PII detected.',
    };
  }

  const factors: RiskEvaluation['factors'] = [];
  let baseScore = 0;
  let hasCritical = false;
  let hasHigh = false;

  for (const item of detections) {
    const config = CATEGORY_WEIGHTS[item.category] || {
      weight: 15,
      severity: item.severity,
      defaultAction: 'REDACT',
    };

    if (config.severity === 'CRITICAL') hasCritical = true;
    if (config.severity === 'HIGH') hasHigh = true;

    baseScore += config.weight;
    factors.push({
      label: `${item.category.replace(/_/g, ' ')} (${item.matchedText ? item.matchedText.slice(0, 4) + '...' : 'Matched'})`,
      scoreContribution: config.weight,
      severity: config.severity,
    });
  }

  // Multiply by AI service risk factor
  const multiplier = SERVICE_RISK_MULTIPLIER[service] || 1.0;
  let finalScore = Math.min(99, Math.round(baseScore * multiplier));

  // Determine overall severity
  let severity: Severity = 'LOW';
  let recommendedAction: PolicyAction = 'ALLOW';

  if (hasCritical || finalScore >= 80) {
    severity = 'CRITICAL';
    recommendedAction = 'BLOCK';
    finalScore = Math.max(finalScore, 88);
  } else if (hasHigh || finalScore >= 55) {
    severity = 'HIGH';
    recommendedAction = 'REDACT';
  } else if (finalScore >= 30) {
    severity = 'MEDIUM';
    recommendedAction = 'WARN';
  } else {
    severity = 'LOW';
    recommendedAction = 'ALLOW';
  }

  const summary = hasCritical
    ? 'Critical security breach risk: high-privilege credentials or secrets detected.'
    : hasHigh
    ? 'High sensitivity: Indian national ID or customer PII detected.'
    : 'Moderate data exposure detected.';

  return {
    riskScore: finalScore,
    severity,
    recommendedAction,
    factors,
    summary,
  };
}

