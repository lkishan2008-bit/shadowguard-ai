export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type PolicyAction = 'ALLOW' | 'WARN' | 'REDACT' | 'BLOCK';
export type IncidentAction = 'BLOCKED' | 'REDACTED' | 'WARNED' | 'ALLOWED';
export type AIServiceName = 'ChatGPT' | 'Claude' | 'Gemini' | 'Microsoft Copilot';
export type AIServiceStatus = 'Protected' | 'Monitoring Only' | 'Not Connected';

export interface DetectionEntity {
  category: string;
  severity: Severity;
  matchedText: string;
  start: number;
  end: number;
}

export interface SecurityIncident {
  id: string;
  employeeName: string;
  employeeEmail: string;
  employeeDepartment: string;
  aiService: AIServiceName;
  detectedCategories: string[];
  severity: Severity;
  riskScore: number;
  action: IncidentAction;
  timestamp: string;
  rawTextPreview: string; // Fake demo redacted content
  sanitizedPreview: string;
  policyTriggered: string;
  status: 'Investigating' | 'Resolved' | 'Acknowledged';
}

export interface EmployeeSecurityProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  aiRequests: number;
  incidentCount: number;
  riskScore: number;
  riskTier: Severity;
  status: 'Active' | 'Under Review' | 'Restricted';
  servicesUsed: AIServiceName[];
  frequentThreats: string[];
  lastActive: string;
}

export interface AIServiceConfig {
  id: string;
  name: AIServiceName;
  status: 'Protected' | 'Monitoring Only' | 'Not Connected';
  requests: number;
  incidents: number;
  riskTier: Severity;
  defaultAction: PolicyAction;
  lastUsed: string;
  iconType: 'chatgpt' | 'claude' | 'gemini' | 'copilot';
}

export interface SecurityPolicyRule {
  id: string;
  name: string;
  category: string;
  severity: Severity;
  action: PolicyAction;
  description: string;
  isIndiaDlp?: boolean;
  enabled: boolean;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change: string;
  subtext: string;
  trend: 'up' | 'down' | 'neutral';
  isPositiveChange?: boolean;
}
