/**
 * @module text_correction/ce
 */

/**
 * @file Text IO helpers for contenteditable and textarea elements.
 */

/**
 * Checks if an element is an HTMLElement with contenteditable=true.
 * @param {Element} el - The element to check.
 * @returns {boolean} - True if el is contenteditable.
 */
export function isContentEditable(el) {
    return el instanceof el.ownerDocument.defaultView.HTMLElement && el.isContentEditable === true;
}

/**
 * Escapes HTML special characters.
 * @param {string} s - The string to escape.
 * @returns {string} - The escaped string.
 */
export function escapeHTML(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/**
 * Writes plain text into a contenteditable element, converting `\n` to `<br>`.
 * If the CE contains exactly one child `<span>`, preserves its inline `style`.
 * NOTE: This intentionally discards complex formatting (by design).
 * @param {HTMLElement} el - The contenteditable element.
 * @param {string} newText - The new plain text to set.
 */
export function setCETextPreservingSimpleSpan(el, newText) {
    const htmlWithBr = escapeHTML(newText).replace(/\r?\n/g, "<br>");
    const first = el.firstElementChild;
    const onlyOne = first && first === el.lastElementChild && first.tagName === "SPAN";
    if (onlyOne) {
        const styleAttr = first.getAttribute("style") || "";
        el.innerHTML = `<span style="${styleAttr}">${htmlWithBr}</span>`;
    } else {
        el.innerHTML = htmlWithBr;
    }
}
