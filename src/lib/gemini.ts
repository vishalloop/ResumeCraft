import { Mistral } from "@mistralai/mistralai";
import { config } from "./config";
import { ApiError } from "@/server/utils/api-error";
import { ContentChunk } from "@mistralai/mistralai/models/components";

const ai = new Mistral({
    apiKey: config.MISTRAL_API_KEY,
});

export async function generateAiContent(prompt: string): Promise<string | ContentChunk[]> {
    try {
        const response = await ai.chat.complete({
          model: "mistral-small-latest",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        return response.choices[0]?.message?.content ?? "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // The @google/genai SDK throws errors with a `status` property
        const status: number | undefined = error?.status ?? error?.httpError?.status;
        const message: string = error?.message ?? "Unknown Gemini API error";

        if (status === 429) {
            throw new ApiError(
                "AI quota exceeded. You have hit the Gemini API rate limit. Please wait a moment and try again.",
                429
            );
        }

        if (status === 403) {
            throw new ApiError(
                "AI access denied. Your Gemini API key does not have permission to use this model.",
                403
            );
        }

        if (status === 400) {
            throw new ApiError(
                "Invalid request sent to Gemini API. Please check the prompt content.",
                400
            );
        }

        // Generic fallback for other Gemini errors
        throw new ApiError(`Gemini API error (${status ?? "unknown"}): ${message}`, 502);
    }
}