import type { AIServiceName, AIServiceStatus } from '../types';

export interface AIAnalyzeResult {
  success: boolean;
  service: AIServiceName;
  result: string;
  modelUsed?: string;
  configured?: boolean;
  fallback?: boolean;
  error?: string;
  timestamp: string;
}

export interface ProviderStatusInfo {
  configured: boolean;
  status: AIServiceStatus;
  model: string;
}

/**
 * Client-side interface to ShadowGuard AI analysis endpoint (/api/ai/analyze).
 * Never uses or requires client-side API secrets.
 */
export async function analyzePromptWithAI(
  service: AIServiceName,
  sanitizedPrompt: string,
  signal?: AbortSignal
): Promise<AIAnalyzeResult> {
  const timestamp = new Date().toISOString();

  if (!sanitizedPrompt || !sanitizedPrompt.trim()) {
    return {
      success: false,
      service,
      result: 'No prompt text provided.',
      error: 'Prompt cannot be empty.',
      timestamp,
    };
  }

  if (service === 'Microsoft Copilot') {
    return {
      success: false,
      service,
      configured: false,
      fallback: true,
      result:
        '[ShadowGuard] Microsoft Copilot is currently Not Connected. Enterprise integration is pending in Phase 3.',
      error: 'Microsoft Copilot is not connected.',
      timestamp,
    };
  }

  try {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service,
        prompt: sanitizedPrompt,
      }),
      signal: signal || AbortSignal.timeout(18000),
    });

    if (!response.ok) {
      return {
        success: false,
        service,
        fallback: true,
        result: `[ShadowGuard Fallback] AI endpoint returned status ${response.status}. Intercepted prompt was verified by local DLP engine.`,
        error: `Server responded with HTTP ${response.status}`,
        timestamp,
      };
    }

    const data = (await response.json()) as AIAnalyzeResult;
    return {
      success: data.success,
      service: (data.service as AIServiceName) || service,
      result: data.result || 'No response text returned from provider.',
      modelUsed: data.modelUsed,
      configured: data.configured,
      fallback: data.fallback,
      error: data.error,
      timestamp: data.timestamp || timestamp,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network or timeout failure';
    return {
      success: false,
      service,
      fallback: true,
      result: `[ShadowGuard Safe Fallback] Sanitized prompt was evaluated locally. Upstream AI connection unavailable (${message}).`,
      error: message,
      timestamp,
    };
  }
}

/**
 * Fetch provider connection statuses from /api/ai/status.
 */
export async function fetchAIProvidersStatus(): Promise<Record<AIServiceName, ProviderStatusInfo> | null> {
  try {
    const response = await fetch('/api/ai/status', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      success: boolean;
      providers: Record<AIServiceName, ProviderStatusInfo>;
    };

    if (data && data.success && data.providers) {
      return data.providers;
    }
    return null;
  } catch {
    return null;
  }
}
