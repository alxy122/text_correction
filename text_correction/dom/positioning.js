/**
 * @module text_correction/dom
 */

/**
 * @file Icon positioning helpers relative to a given editor element.
 */

/**
 * Computes right offset depending on presence of vertical scrollbar.
 * @param {HTMLTextAreaElement|HTMLElement} input - The editor element.
 * @param {boolean} isTA - True if input is a textarea.
 * @param {boolean} isCE - True if input is contenteditable.
 * @returns {number} - Right offset in pixels.
 */
export function getDynamicOffsetRight(input, isTA, isCE) {
    const hasScroll =
        (isTA && input.scrollHeight > input.clientHeight) ||
        (isCE && input.scrollHeight && input.clientHeight && input.scrollHeight > input.clientHeight);
    return hasScroll ? 40 : 26;
}

/**
 * Places icons near the bottom-right of the editor. Hides them if editor is detached or 0×0.
 * @param {HTMLTextAreaElement|HTMLElement} input - The editor element.
 * @param {{corr: HTMLDivElement, redo: HTMLDivElement, undo: HTMLDivElement}} icons - The icon elements.
 * @param {boolean} hasRedo - Whether the redo icon should be shown.
 * @param {boolean} isTA - True if input is a textarea.
 * @param {boolean} isCE - True if input is contenteditable.
 */
export function placeIcons(input, icons, hasRedo, isTA, isCE) {
    const { corr, redo, undo } = icons;

    if (!input.isConnected) {
        corr.style.display = "none";
        redo.style.display = "none";
        undo.style.display = "none";
        return;
    }
    const rect = input.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
        corr.style.display = "none";
        redo.style.display = "none";
        undo.style.display = "none";
        return;
    }

    const ICON_SIZE = 20, GAP = 6;
    const OFFSET_RIGHT = getDynamicOffsetRight(input, isTA, isCE);
    const OFFSET_BOTTOM = 8;

    const corrLeft = Math.max(0, rect.right - OFFSET_RIGHT);
    const rowTop = Math.max(0, rect.bottom - OFFSET_BOTTOM - ICON_SIZE);

    const undoLeft = hasRedo
        ? (corrLeft - ICON_SIZE - GAP * 2 - ICON_SIZE)
        : (corrLeft - ICON_SIZE - GAP);
    const redoLeft = hasRedo ? (corrLeft - ICON_SIZE - GAP) : null;

    corr.style.left = corrLeft + "px";
    corr.style.top = rowTop + "px";
    if (hasRedo && redoLeft != null) {
        redo.style.left = redoLeft + "px";
        redo.style.top = rowTop + "px";
    }
    undo.style.left = undoLeft + "px";
    undo.style.top = rowTop + "px";
}