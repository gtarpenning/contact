import { OpenAI } from 'openai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const SYSTEM_PROMPT_S = `
Find the semantic/logical midpoint between the two words. 

Only respond with the word, nothing else.
When possible, respond with a common word.

Example:
  word1: sailing, word2: sailboat
  possible responses: sail, boat, ocean

Example:
  word1: tree, word2: house
  possible responses: treehouse, wood
`;

// const client = wrapOpenAI(new OpenAI());
const client = new OpenAI();

interface MsgRequestBody {
  msg: string;
  prevMsg: string;
}

async function handleMsg(msg: string, prevMsg: string): Promise<string> {
  try {
    const userPrompt = `word1: ${prevMsg}, word2: ${msg}`;
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_S },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 20,
      temperature: 1,
    });

    return completion.choices[0].message.content ?? '';
  } catch (e) {
    console.error('Error:', e);
    throw new Error(`Error: ${e}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // await weave.login(process.env.WANDB_API_KEY ?? '');
    // await weave.init('contact-ts');

    const body = (await req.body) as MsgRequestBody;
    const { msg, prevMsg } = body;

    // const handleMsgWrapped = op(handleMsg);

    const result = await handleMsg(msg, prevMsg);
    return res.status(200).json({ response: result });
  } catch (e) {
    console.error('Error in handler:', e);
    return res.status(500).json({ error: e });
  }
}
