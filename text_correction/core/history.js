/**
 * @module text_correction/core
 */

/**
 * @file History/redo management and debounce helper.
 */

/**
 * Simple debounce utility using the document/window timers.
 * @template {Function} F - Function type.
 * @param {Window} win - Window to use for timers.
 * @param {F} fn - Function to debounce.
 * @param {number} ms - Milliseconds to wait after the last call.
 * @returns {F} - Debounced function.
 */
export function debounce(win, fn, ms) {
    let t;
    return (...args) => {
        win.clearTimeout(t);
        t = win.setTimeout(() => fn(...args), ms);
    };
}

/**
 * History manager for editor values (with redo stack).
 * Stores strings; capped by `max`.
 * Ignores identical consecutive snapshots.
 * Has a flag to avoid recording during undo/redo operations.
 * @class
 * @param {string} initial - Initial value.
 * @param {number} [max=50] - Maximum history size.
 * @example
 * const hist = new HistoryManager("initial", 50);
 * hist.snapshot("first change");
 * hist.snapshot("second change");
 * hist.undo(); // returns "first change"
 * hist.redoOnce(); // returns "second change"
 * hist.push("forced change"); // forces a push, even if identical
 * hist.canUndo(); // true
 * hist.canRedo(); // false
 * hist.clearRedo(); // clears redo stack
 * hist.snapshot("second change"); // ignored, identical to last
 * hist.snapshot("third change"); // recorded
 *
 */
export class HistoryManager {
    /**
     * @param {string} initial - Initial value.
     * @param {number} [max=50] - Maximum history size.
     */
    constructor(initial, max = 50) {
        /** @type {string[]} */
        this.history = [initial];
        /** @type {string[]} */
        this.redo = [];
        /** @type {number} */
        this.max = max;
        /** @type {boolean} */
        this.isRestoring = false;
    }

    /** @returns {boolean} - Whether undo is possible. */
    canUndo() { return this.history.length > 1; }
    /** @returns {boolean} - Whether redo is possible. */
    canRedo() { return this.redo.length > 0; }

    /** Clears redo stack. */
    clearRedo() { this.redo.length = 0; }

    /**
     * Pushes a snapshot if `val` differs from the last one.
     * Trims to max and clears redo.
     * @param {string} val - New value to snapshot.
     */
    snapshot(val) {
        if (this.isRestoring) return;
        const last = this.history[this.history.length - 1];
        if (val === last) return;
        this.history.push(val);
        if (this.history.length > this.max) this.history.shift();
        this.clearRedo();
    }

    /**
     * Forces push (even if equal to last), trimming to max.
     * Does not clear redo by itself.
     * @param {string} val - Value to push.
     */
    push(val) {
        this.history.push(val);
        if (this.history.length > this.max) this.history.shift();
    }

    /**
     * Undo: pop current to redo, return new current.
     * @returns {string|null} - New current value or null if cannot undo.
     */
    undo() {
        if (!this.canUndo()) return null;
        this.isRestoring = true;
        try {
            const current = this.history.pop();
            this.redo.push(current);
            return this.history[this.history.length - 1];
        } finally {
            this.isRestoring = false;
        }
    }

    /**
     * Redo: pop from redo, push into history, return it.
     * @returns {string|null} - Redone value or null if cannot redo.
     */
    redoOnce() {
        if (!this.canRedo()) return null;
        this.isRestoring = true;
        try {
            const next = this.redo.pop();
            this.history.push(next);
            return next;
        } finally {
            this.isRestoring = false;
        }
    }
}
