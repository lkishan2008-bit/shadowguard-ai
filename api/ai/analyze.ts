import type { IncomingMessage, ServerResponse } from 'node:http';

interface AnalyzeRequestBody {
  service?: string;
  prompt?: string;
}

interface AIResponsePayload {
  success: boolean;
  service: string;
  result?: string;
  modelUsed?: string;
  fallback?: boolean;
  configured?: boolean;
  error?: string;
  timestamp: string;
}

const MAX_PROMPT_LENGTH = 32000;
const REQUEST_TIMEOUT_MS = 15000;

async function parseBody(req: IncomingMessage & { body?: unknown }): Promise<AnalyzeRequestBody | null> {
  if (req.body && typeof req.body === 'object') {
    return req.body as AnalyzeRequestBody;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as AnalyzeRequestBody;
    } catch {
      return null;
    }
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk: Buffer | string) => {
      data += chunk;
      if (data.length > MAX_PROMPT_LENGTH * 2) {
        resolve(null);
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data) as AnalyzeRequestBody);
      } catch {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
}

function sendJsonResponse(res: ServerResponse, statusCode: number, payload: AIResponsePayload): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.end(JSON.stringify(payload));
}

// ── Provider Execution Handlers ──────────────────────────────────────────────

async function callOpenAI(prompt: string, apiKey: string): Promise<{ result: string; model: string }> {
  const model = 'gpt-4o-mini';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a secure, privacy-preserving enterprise AI assistant. Process the following sanitized user request accurately.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1024,
      temperature: 0.3,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`OpenAI API error (${response.status}): ${errorText.slice(0, 160)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('OpenAI returned an empty completion response.');
  }

  return { result: text.trim(), model };
}

async function callAnthropic(prompt: string, apiKey: string): Promise<{ result: string; model: string }> {
  const model = 'claude-3-haiku-20240307';
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Anthropic API error (${response.status}): ${errorText.slice(0, 160)}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ type?: string; text?: string }>;
  };
  const text = data.content?.[0]?.text;
  if (!text) {
    throw new Error('Anthropic returned an empty message response.');
  }

  return { result: text.trim(), model };
}

async function callGemini(prompt: string, apiKey: string): Promise<{ result: string; model: string }> {
  const model = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.3,
      },
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Gemini API error (${response.status}): ${errorText.slice(0, 160)}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned an empty text candidate.');
  }

  return { result: text.trim(), model };
}

// ── Vercel Serverless Function Handler ───────────────────────────────────────

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const timestamp = new Date().toISOString();

  // Allow only POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJsonResponse(res, 405, {
      success: false,
      service: 'Unknown',
      error: 'Method Not Allowed. Use POST.',
      timestamp,
    });
    return;
  }

  // Parse and validate incoming payload
  const body = await parseBody(req);
  if (!body || typeof body.prompt !== 'string' || !body.prompt.trim()) {
    sendJsonResponse(res, 400, {
      success: false,
      service: typeof body?.service === 'string' ? body.service : 'Unknown',
      error: 'Invalid request: "prompt" string is required and cannot be empty.',
      timestamp,
    });
    return;
  }

  const prompt = body.prompt.trim();
  if (prompt.length > MAX_PROMPT_LENGTH) {
    sendJsonResponse(res, 413, {
      success: false,
      service: body.service || 'Unknown',
      error: `Prompt exceeds maximum allowed size of ${MAX_PROMPT_LENGTH} characters.`,
      timestamp,
    });
    return;
  }

  const service = (body.service || 'ChatGPT').trim();

  // Microsoft Copilot is intentionally not connected yet
  if (service === 'Microsoft Copilot') {
    sendJsonResponse(res, 400, {
      success: false,
      service: 'Microsoft Copilot',
      configured: false,
      error: 'Microsoft Copilot integration is not yet connected in this enterprise environment.',
      timestamp,
    });
    return;
  }

  // Resolve server-side API Key (never returned or exposed to client)
  let apiKey = '';
  if (service === 'ChatGPT') {
    apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || '';
  } else if (service === 'Claude') {
    apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY || '';
  } else if (service === 'Gemini') {
    apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  } else {
    sendJsonResponse(res, 400, {
      success: false,
      service,
      error: `Unsupported AI service: "${service}". Supported services: ChatGPT, Claude, Gemini.`,
      timestamp,
    });
    return;
  }

  // If no API key configured on server, provide safe fallback
  if (!apiKey || apiKey.length < 5) {
    sendJsonResponse(res, 200, {
      success: false,
      service,
      configured: false,
      fallback: true,
      error: `Server-side API key for ${service} is not configured. Please set the environment variable.`,
      result: `[ShadowGuard DLP Safe Fallback] Prompt intercepted and sanitized successfully. ${service} endpoint is in Monitoring Only mode (no external API key configured on server).`,
      timestamp,
    });
    return;
  }

  // Dispatch request to AI Provider
  try {
    let outcome: { result: string; model: string };
    if (service === 'ChatGPT') {
      outcome = await callOpenAI(prompt, apiKey);
    } else if (service === 'Claude') {
      outcome = await callAnthropic(prompt, apiKey);
    } else {
      outcome = await callGemini(prompt, apiKey);
    }

    sendJsonResponse(res, 200, {
      success: true,
      service,
      configured: true,
      result: outcome.result,
      modelUsed: outcome.model,
      timestamp,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upstream provider request failed';
    // Return safe structured fallback without leaking secrets
    sendJsonResponse(res, 200, {
      success: false,
      service,
      configured: true,
      fallback: true,
      error: `Upstream AI provider error: ${message}`,
      result: `[ShadowGuard DLP Fallback] Sanitized prompt was routed to ${service}, but upstream service returned a temporary error (${message}).`,
      timestamp,
    });
  }
}
