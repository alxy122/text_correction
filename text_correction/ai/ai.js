/**
 * @module text_correction/ai
 */

/**
 * @typedef {Object} AiConfig
 * @property {string} baseUrl - Base URL of an OpenAI-compatible API, e.g. "https://api.openai.com/v1".
 * @property {string} [apiKey] - API key, sent as Bearer token. Optional for local servers like Ollama.
 * @property {string} model - Model name, e.g. "gpt-4o-mini" or "qwen2.5:7b-instruct".
 */

/**
 * Get text correction via an OpenAI-compatible Chat Completions API
 * @async
 * @function
 * @param {string} inputText - The text to be corrected
 * @param {AiConfig} config - API connection settings
 * @returns {Promise<string|null>} - The corrected text, or null if no correction was made
 */
export async function getTextCorrection(inputText, config) {
    const { baseUrl, apiKey, model } = config;
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

    const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            model,
            messages: [
                {
                    role: "system",
                    content: "You are a precise proofreader. Improve grammar, style, clarity and all spelling mistakes. Return ONLY the corrected text in the language of the input."
                },
                { role: "user", content: inputText }
            ],
            temperature: 0.2
        })
    });

    if (!res.ok) {
        const err = await res.text().catch(() => "");
        throw new Error(`API Fehler: ${res.status} ${res.statusText} ${err}`);
    }
    const data = await res.json();
    if (data?.choices?.[0]?.message?.content) {
        return data.choices[0].message.content.trim();
    }
    return null;
}
