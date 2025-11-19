/**
 * @module text_correction/core
 */

/**
 * @file Same-origin iframe scanning and observation.
 */

/**
 * Scans same-origin iframes and calls `provide(doc)` on them (immediately or on load).
 * @param {Document} doc - The document to scan.
 * @param {function(Document): void} provide - Function to call with each iframe's document.
 */
export function scanIframes(doc, provide) {
    const iframes = doc.querySelectorAll("iframe");
    iframes.forEach((ifr) => {
        try {
            const idoc = ifr.contentDocument;
            if (!idoc) return;
            if (idoc.readyState === "complete" || idoc.readyState === "interactive") {
                provide(idoc);
            } else {
                ifr.addEventListener("load", () => {
                    try { provide(ifr.contentDocument); } catch { /* ignore */ }
                }, { once: true });
            }
        } catch {
            // cross-origin -> ignore
        }
    });
}

/**
 * Observes newly added iframes and wires their load handlers to call `provide`.
 * Returns the MutationObserver instance.
 * @param {Document} doc - The document to observe.
 * @param {function(Document): void} provide - Function to call with each iframe's document.
 * @returns {MutationObserver} - The created MutationObserver instance.
 */
export function observeIframes(doc, provide) {
    const iframeObserver = new doc.defaultView.MutationObserver(muts => {
        for (const m of muts) {
            for (const n of m.addedNodes) {
                if (n.nodeType !== Node.ELEMENT_NODE) continue;
                if (n.tagName === "IFRAME") {
                    try {
                        n.addEventListener("load", () => {
                            try { provide(n.contentDocument); } catch { /* ignore */ }
                        });
                    } catch { /* ignore */ }
                } else {
                    const innerIframes = n.querySelectorAll?.("iframe");
                    innerIframes && innerIframes.forEach((ifr) => {
                        try {
                            ifr.addEventListener("load", () => {
                                try { provide(ifr.contentDocument); } catch { /* ignore */ }
                            });
                        } catch { /* ignore */ }
                    });
                }
            }
        }
    });
    if (doc.body) iframeObserver.observe(doc.body, { childList: true, subtree: true });
    return iframeObserver;
}
