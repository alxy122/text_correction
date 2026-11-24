// Imports the package the same way another project would after
// `npm install text-correction` (here linked via "file:../..").
import { getTextCorrection } from "text-correction";

const input = process.argv[2] ?? "Ich habe gestern mit mein Kollege ein Meeting gehabt, das war sehr interesant.";

const corrected = await getTextCorrection(input, {
    baseUrl: process.env.BASE_URL,
    apiKey: process.env.API_KEY,
    model: process.env.MODEL
});

console.log("Input:    ", input);
console.log("Corrected:", corrected);
