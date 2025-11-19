const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

/**
 * Get text correction using OpenAI's Chat Completions API
 * @async
 * @function
 * @param {string} inputText - The text to be corrected
 * @returns {Promise<string|null>} - The corrected text, or null if no correction was made
 */
export async function getTextCorrection(inputText) {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
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
        throw new Error(`OpenAI Fehler: ${res.status} ${res.statusText} ${err}`);
    }
    const data = await res.json();
    if (data?.choices?.[0]?.message?.content) {
        return data.choices[0].message.content.trim();
    }
    return null;
}