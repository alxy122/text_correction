/**
 * @module text_correction/dom
 */

/**
 * @file Spinner CSS injection for the text correction UI.
 * Injects the spinner keyframes only once per document.
 */

/**
 * Ensures spinner CSS is injected exactly once per document.
 * @param {Document} doc - The document to inject CSS into.
 */
export function ensureSpinnerCSS(doc) {
    if (doc.getElementById("__text_corr_spinner_css__")) return;
    const style = doc.createElement("style");
    style.id = "__text_corr_spinner_css__";
    style.textContent = `
      @keyframes text_corr_spin { to { transform: rotate(360deg); } }
      .text_corr-spinner {
        width: 18px; height: 18px; box-sizing: border-box;
        border: 2px solid rgba(255, 255, 255, 1);
        border-top-color: #000000ff; border-radius: 50%;
        animation: text_corr_spin 0.8s linear infinite;
      }
    `;
    doc.head && doc.head.appendChild(style);
}