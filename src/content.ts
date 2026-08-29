import { sanitizePrompt } from './redaction/redactor';

function attachDLPScanner() {
  // Target inputs across ChatGPT, Gemini, and Claude
  const selectors = [
    'textarea',
    'div[contenteditable="true"]',
    '#prompt-textarea',
  ];

  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (el.getAttribute('data-shadowguard-active')) return;
      el.setAttribute('data-shadowguard-active', 'true');

      el.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement | HTMLDivElement;
        const text = 'value' in target ? target.value : target.innerText;

        const { detections } = sanitizePrompt(text);

        if (detections.length > 0) {
          console.warn('[ShadowGuard AI] Sensitive data detected:', detections);
        }
      });
    });
  });
}

// Observe dynamic DOM updates for single-page apps (SPAs)
const observer = new MutationObserver(() => attachDLPScanner());
observer.observe(document.body, { childList: true, subtree: true });

attachDLPScanner();
