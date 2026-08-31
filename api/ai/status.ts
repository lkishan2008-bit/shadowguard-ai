import type { IncomingMessage, ServerResponse } from 'node:http';

interface ProviderStatus {
  configured: boolean;
  status: 'Protected' | 'Monitoring Only' | 'Not Connected';
  model: string;
}

interface StatusResponsePayload {
  success: boolean;
  providers: Record<string, ProviderStatus>;
  timestamp: string;
}

function sendJsonResponse(res: ServerResponse, statusCode: number, payload: StatusResponsePayload): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.end(JSON.stringify(payload));
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const timestamp = new Date().toISOString();

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  const openAiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || '';
  const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY || '';
  const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

  const isOpenAiConfigured = openAiKey.length > 5;
  const isAnthropicConfigured = anthropicKey.length > 5;
  const isGeminiConfigured = geminiKey.length > 5;

  const providers: Record<string, ProviderStatus> = {
    ChatGPT: {
      configured: isOpenAiConfigured,
      status: isOpenAiConfigured ? 'Protected' : 'Not Connected',
      model: 'gpt-4o-mini',
    },
    Claude: {
      configured: isAnthropicConfigured,
      status: isAnthropicConfigured ? 'Protected' : 'Not Connected',
      model: 'claude-3-haiku-20240307',
    },
    Gemini: {
      configured: isGeminiConfigured,
      status: isGeminiConfigured ? 'Protected' : 'Not Connected',
      model: 'gemini-3.7-flash',
    },
  };

  sendJsonResponse(res, 200, {
    success: true,
    providers,
    timestamp,
  });
}


