import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";

const ROOT_DIR = fileURLToPath(new URL("../..", import.meta.url));

// Variables read from the project's .env and injected into the demo as process.env.*
const ENV_KEYS = ["BASE_URL", "API_KEY", "MODEL"];

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, ROOT_DIR, "");

    const missing = ENV_KEYS.filter((key) => !env[key]);
    if (missing.length) {
        throw new Error(`Missing environment variables in .env: ${missing.join(", ")}`);
    }

    return {
        root: fileURLToPath(new URL(".", import.meta.url)),
        define: Object.fromEntries(
            ENV_KEYS.map((key) => [`process.env.${key}`, JSON.stringify(env[key])])
        ),
        server: { port: 8080 }
    };
});
