/**
 * @module text_correction/dom
 */

/**
 * @file Icon helpers for the text correction UI (✎, ↶, ↷).
 */

/**
 * Creates a fixed-position circular icon inside the given document.
 * Appended to the document’s scrolling element (not inside the editor).
 * @param {Document} doc - The document to create the icon in.
 * @param {string} symbol - Initial textContent of the icon (e.g., "✎").
 * @param {string} [title] - Tooltip title.
 * @returns {HTMLDivElement} - The created icon element.
 */
export function makeIcon(doc, symbol, title) {
    const el = doc.createElement("div");
    el.textContent = symbol;
    el.title = title || "";
    el.setAttribute("contenteditable", "false");
    Object.assign(el.style, {
        position: "fixed",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        color: "white",
        fontSize: "12px",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: "2147483647",
        display: "none",
        boxShadow: "0 1px 3px rgba(0,0,0,.2)",
        userSelect: "none",
        pointerEvents: "auto",
    });
    (doc.scrollingElement || doc.documentElement || doc.body).appendChild(el);
    return el;
}

/**
 * Replaces icon content with a spinner element.
 * @param {HTMLDivElement} icon
 * @returns {HTMLDivElement} - The spinner node appended to the icon.
 */
export const showSpinner = (icon) => {
    icon.style.background = "transparent";
    icon.textContent = "";
    const sp = icon.ownerDocument.createElement("div");
    sp.className = "text_corr-spinner";
    icon.appendChild(sp);
    return sp;
};

/**
 * Shows a transient success state (✓) and then restores ✎ + orange background.
 * @param {HTMLDivElement} icon - The icon element to update.
 */
export const showTick = (icon) => {
    icon.innerHTML = "✓";
    icon.style.background = "#1ba24b";
    setTimeout(() => {
        icon.innerHTML = "✎";
        icon.style.background = "#ffae00ff";
    }, 2000);
};

/**
 * Shows a transient error state (!) and then restores ✎ + orange background.
 * @param {HTMLDivElement} icon
 */
export const showError = (icon) => {
    icon.innerHTML = "!";
    icon.style.background = "#d93025";
    setTimeout(() => {
        icon.innerHTML = "✎";
        icon.style.background = "#ffae00ff";
    }, 2000);
};