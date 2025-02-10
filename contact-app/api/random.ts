import { OpenAI } from 'openai';
// import weave, { op, wrapOpenAI } from 'weave';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// const client = wrapOpenAI(new OpenAI());
const client = new OpenAI();

const SYSTEM_PROMPT_INITIAL = `
generate a *random* word, examples: 
- guacamole
- despair
- purple
- jellybean
- onomonopeia
- kumquat
- worm
- marxism

ONLY respond with the exact word, nothing else.
`;

async function getInitialWord() {
  try {
    const model = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT_INITIAL }
      ],
      max_tokens: 20,
    });

    return model.choices[0].message.content?.toLowerCase() ?? '';
  } catch (e) {
    console.error("Error in getInitialWord:", e);
    throw new Error(`Error: ${e}`);
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // await weave.login(process.env.WANDB_API_KEY ?? '');
    // await weave.init('contact-ts');

    // const getInitialWordWrapped = op(getInitialWord);

    const result = await getInitialWord();    
    return res.status(200).json({ response: result });
  } catch (e) {
    console.error('Error in handler:', e);
    return res.status(500).json({ error: e });
  }
} 