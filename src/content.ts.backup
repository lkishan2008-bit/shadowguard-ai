/**
 * ShadowGuard AI — DLP Content Script
 * Runs on: ChatGPT, Gemini, Claude
 *
 * Intercepts prompt submission, evaluates risk, then:
 *   ALLOW  → submits normally
 *   WARN   → shows non-blocking warning banner; user can dismiss and proceed
 *   REDACT → silently rewrites detected values with [REDACTED_*] tokens, then submits
 *   BLOCK  → prevents submission and shows a hard security warning
 */

import { sanitizePrompt } from './redaction/redactor';
import { evaluateRisk } from './detection/riskEngine';
import type { AIServiceName } from './types';

// ── Constants ─────────────────────────────────────────────────────────────────

const ATTR = 'data-sg-active';     // marks elements that already have listeners
const MODAL_ID = 'sg-dlp-modal';   // single modal kept in DOM at all times

// Detect which AI service we're on
function detectService(): AIServiceName {
  const host = location.hostname;
  if (host.includes('chatgpt.com')) return 'ChatGPT';
  if (host.includes('gemini.google.com')) return 'Gemini';
  if (host.includes('claude.ai')) return 'Claude';
  return 'ChatGPT';
}

const SERVICE: AIServiceName = detectService();

// ── Selectors (per-service submit buttons) ────────────────────────────────────

const SEND_BUTTON_SELECTORS = [
  // ChatGPT
  'button[data-testid="send-button"]',
  'button[aria-label="Send prompt"]',
  // Gemini
  'button.send-button',
  'button[aria-label="Send message"]',
  'mat-icon[data-mat-icon-name="send"]',
  // Claude
  'button[aria-label="Send Message"]',
  'button[data-value="send"]',
  // Generic fallback
  'button[type="submit"]',
];

const INPUT_SELECTORS = [
  '#prompt-textarea',          // ChatGPT
  'div[contenteditable="true"]',
  'textarea',
];

// ── Get current text from an input element ────────────────────────────────────

function getInputText(el: Element): string {
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    return el.value;
  }
  if ((el as HTMLElement).isContentEditable) {
    return (el as HTMLElement).innerText;
  }
  return '';
}

function setInputText(el: Element, text: string): void {
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    )?.set ?? Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;

    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(el, text);
    } else {
      el.value = text;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
  } else if ((el as HTMLElement).isContentEditable) {
    // For contenteditable we must place the new text and fire input events
    (el as HTMLElement).innerText = text;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    // Move cursor to end
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
}

// ── Modal / UI helpers ────────────────────────────────────────────────────────

function ensureModalContainer(): HTMLElement {
  let modal = document.getElementById(MODAL_ID);
  if (!modal) {
    modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 64px;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    `;
    document.body.appendChild(modal);
  }
  return modal;
}

function closeModal(): void {
  const modal = document.getElementById(MODAL_ID);
  if (modal) modal.innerHTML = '';
}

// Colour tokens
const COLOR: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  WARN:  { bg: '#1a1200', border: '#ca8a04', badge: '#854d0e', text: '#fbbf24' },
  BLOCK: { bg: '#1a0000', border: '#dc2626', badge: '#7f1d1d', text: '#f87171' },
};

interface ModalOptions {
  action: 'WARN' | 'BLOCK';
  categories: string[];
  riskScore: number;
  onProceed?: () => void;
}

function showModal({ action, categories, riskScore, onProceed }: ModalOptions): void {
  const container = ensureModalContainer();
  container.innerHTML = ''; // clear any previous

  const c = COLOR[action];
  const isBlock = action === 'BLOCK';

  const card = document.createElement('div');
  card.style.cssText = `
    background: ${c.bg};
    border: 1.5px solid ${c.border};
    border-radius: 16px;
    padding: 20px 24px;
    max-width: 440px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.7);
    pointer-events: all;
    color: #f1f5f9;
    position: relative;
  `;

  const icon = isBlock ? '🚫' : '⚠️';
  const title = isBlock ? 'Submission Blocked' : 'Sensitive Data Detected';
  const subtitle = isBlock
    ? 'This prompt contains critical secrets or PII and cannot be sent.'
    : 'Your prompt contains potentially sensitive information.';

  const tagList = categories
    .map(
      (cat) =>
        `<span style="display:inline-block;padding:2px 8px;border-radius:999px;
          background:${c.badge};color:${c.text};font-size:11px;font-weight:600;
          letter-spacing:0.06em;margin:2px 3px 2px 0">${cat.replace(/_/g, ' ')}</span>`
    )
    .join('');

  card.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px">
      <div style="font-size:24px;line-height:1">${icon}</div>
      <div style="flex:1">
        <div style="font-size:15px;font-weight:700;color:${c.text};margin-bottom:3px">${title}</div>
        <div style="font-size:12px;color:#94a3b8">${subtitle}</div>
      </div>
      <div style="font-size:10px;font-weight:700;color:${c.text};background:${c.badge};
        padding:3px 7px;border-radius:6px;white-space:nowrap">Risk ${riskScore}</div>
    </div>
    <div style="margin-bottom:16px;line-height:1.7">${tagList}</div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      ${
        !isBlock
          ? `<button id="sg-proceed" style="
              padding:7px 16px;border-radius:8px;border:1px solid ${c.border};
              background:transparent;color:${c.text};font-size:12px;font-weight:600;
              cursor:pointer">Send Anyway</button>`
          : ''
      }
      <button id="sg-dismiss" style="
        padding:7px 16px;border-radius:8px;border:none;
        background:${isBlock ? c.border : '#334155'};
        color:#fff;font-size:12px;font-weight:600;cursor:pointer">
        ${isBlock ? 'Dismiss' : 'Cancel'}
      </button>
    </div>
    <div style="margin-top:12px;font-size:10px;color:#475569;text-align:right">
      🛡️ ShadowGuard AI — ${SERVICE}
    </div>
  `;

  container.appendChild(card);
  container.style.pointerEvents = 'all';

  document.getElementById('sg-dismiss')?.addEventListener('click', () => {
    closeModal();
    container.style.pointerEvents = 'none';
  });

  if (!isBlock) {
    document.getElementById('sg-proceed')?.addEventListener('click', () => {
      closeModal();
      container.style.pointerEvents = 'none';
      onProceed?.();
    });
  }
}

// ── Core DLP enforcement ──────────────────────────────────────────────────────

/**
 * Called when the user attempts to submit a prompt.
 * @param inputEl - The active input/textarea/contenteditable element.
 * @param doSubmit - Callback that actually performs the native submit action.
 */
function enforceDLP(inputEl: Element, doSubmit: () => void): void {
  const text = getInputText(inputEl);
  if (!text.trim()) {
    doSubmit();
    return;
  }

  const { sanitizedText, detections } = sanitizePrompt(text);
  if (detections.length === 0) {
    doSubmit();
    return;
  }

  const evaluation = evaluateRisk(detections, SERVICE);
  const { recommendedAction, riskScore } = evaluation;
  const categories = [...new Set(detections.map((d) => d.category))];

  console.info(
    `[ShadowGuard AI] ${SERVICE} — ${recommendedAction} (risk ${riskScore})`,
    categories
  );

  switch (recommendedAction) {
    case 'ALLOW':
      doSubmit();
      break;

    case 'WARN':
      showModal({
        action: 'WARN',
        categories,
        riskScore,
        onProceed: () => doSubmit(),
      });
      break;

    case 'REDACT':
      // Rewrite the prompt silently, then submit
      setInputText(inputEl, sanitizedText);
      // Small tick to let SPA state settle before submitting
      setTimeout(() => doSubmit(), 80);
      break;

    case 'BLOCK':
      showModal({ action: 'BLOCK', categories, riskScore });
      break;

    default:
      doSubmit();
  }
}

// ── Find the active input element ─────────────────────────────────────────────

function findActiveInput(): Element | null {
  for (const sel of INPUT_SELECTORS) {
    const els = Array.from(document.querySelectorAll(sel));
    // Prefer one that has content
    const active = els.find((el) => getInputText(el).trim().length > 0);
    if (active) return active;
    if (els.length > 0) return els[0];
  }
  return null;
}

// ── Attach submit interceptors ────────────────────────────────────────────────

function attachSubmitInterceptors(): void {
  // 1. Intercept send-button clicks
  for (const sel of SEND_BUTTON_SELECTORS) {
    document.querySelectorAll(sel).forEach((btn) => {
      if (btn.getAttribute(ATTR)) return;
      btn.setAttribute(ATTR, 'true');

      btn.addEventListener(
        'click',
        (e) => {
          const inputEl = findActiveInput();
          if (!inputEl || !getInputText(inputEl).trim()) return; // nothing to check

          const text = getInputText(inputEl);
          const { detections } = sanitizePrompt(text);
          if (detections.length === 0) return; // clean — let it through

          // We must prevent the default click so the SPA doesn't submit yet
          e.preventDefault();
          e.stopImmediatePropagation();

          enforceDLP(inputEl, () => {
            // Re-fire a real click bypassing our listener
            btn.setAttribute(ATTR, 'bypass');
            (btn as HTMLElement).click();
            btn.setAttribute(ATTR, 'true');
          });
        },
        true // capture phase — runs before SPA handlers
      );
    });
  }

  // 2. Intercept Enter on textareas / contenteditable
  for (const sel of INPUT_SELECTORS) {
    document.querySelectorAll(sel).forEach((el) => {
      const key = 'sg-keydown';
      if (el.getAttribute(key)) return;
      el.setAttribute(key, 'true');

      el.addEventListener(
        'keydown',
        (e) => {
          const ke = e as KeyboardEvent;
          // Enter without Shift submits in ChatGPT / Claude / Gemini
          if (ke.key !== 'Enter' || ke.shiftKey) return;

          const text = getInputText(el);
          if (!text.trim()) return;

          const { detections } = sanitizePrompt(text);
          if (detections.length === 0) return; // clean

          ke.preventDefault();
          ke.stopImmediatePropagation();

          enforceDLP(el, () => {
            // Re-dispatch a clean Enter to trigger the SPA submit
            el.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                bubbles: true,
                cancelable: true,
              })
            );
          });
        },
        true
      );
    });
  }

  // 3. Intercept native form submits (fallback)
  document.querySelectorAll('form').forEach((form) => {
    if (form.getAttribute(ATTR)) return;
    form.setAttribute(ATTR, 'true');

    form.addEventListener(
      'submit',
      (e) => {
        const inputEl = findActiveInput();
        if (!inputEl) return;
        const text = getInputText(inputEl);
        if (!text.trim()) return;

        const { detections } = sanitizePrompt(text);
        if (detections.length === 0) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        enforceDLP(inputEl, () => {
          form.setAttribute(ATTR, 'bypass');
          form.requestSubmit();
          form.setAttribute(ATTR, 'true');
        });
      },
      true
    );
  });
}

// ── Observe DOM for SPA dynamic elements ─────────────────────────────────────

const observer = new MutationObserver(() => {
  attachSubmitInterceptors();
});

observer.observe(document.documentElement, { childList: true, subtree: true });

// Initial attach
attachSubmitInterceptors();
