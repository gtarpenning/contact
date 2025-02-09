/* File to handle LLM calls */

import OpenAI from 'openai';

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const client = new OpenAI({
    apiKey: openaiApiKey,
    dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT_S = `
Find the semantic/logical midpoint between the two words. 
Only respond with the word, nothing else.
You cannot use previous words! They will be provided.
`;

const INITIAL_PROMPT = `
generate a *random* word, examples: 
- guacamole
- despair
- purple
- jellybean

ONLY respond with the exact word, nothing else.
`;

/**
 * Pass msg to the LLM and return the response.
 *
 * @param msg - The word to send to the LLM.
 * @param prevMsg - The previous word.
 * @param history - The list of previous messages/words.
 * @returns The response from the LLM.
 */
export async function handleMsg(msg: string, prevMsg: string, history: string[]): Promise<string> {
    // Create the user prompt similar to the Python function.
    const userPrompt = `previous words: [${history.join(', ')}], word1: ${prevMsg}, word2: ${msg}`;
    
    try {
        const stream = await client.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT_S },
                { role: "user", content: userPrompt }
            ],
            max_tokens: 20,
        });
 
        const output = stream.choices[0]?.message?.content || '';
 
        return output;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function getInitialWord(): Promise<string> {
    try {
        const stream = await client.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: INITIAL_PROMPT }],
            max_tokens: 20,
        });

        const output = stream.choices[0]?.message?.content || '';

        return output;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
