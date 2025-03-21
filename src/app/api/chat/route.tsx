import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_TOKEN);

export async function POST(req: Request) {
  const { message, mode } = await req.json();

  let prompt = '';
  if (mode === 'grammar') {
    prompt = `You are an English teacher. First, correct any mistakes in the following message and provide the corrected version. Then, respond to the message in English as if you were having a conversation. Format your response as follows:

**Correction:** [Corrected version of the message, if there are mistakes. If there are no mistakes, say "No corrections needed."]
**Response:** [Your conversational response.]

Message: ${message}`;
  } else if (mode === 'conversation') {
    prompt = `You are a friendly English conversation partner. Respond to the following message in English as if you were having a natural conversation. Do not focus on correcting mistakes unless they hinder understanding, but provide a natural and engaging response.

Message: ${message}`;
  } else if (mode === 'listening') {
    prompt = `You are an English teacher helping with listening practice. Respond to the following message in English with a short conversational response. The response should be suitable for text-to-speech audio output.

Message: ${message}`;
  } else if (mode === 'voice') {
    prompt = `You are an English teacher helping with voice-only conversation practice. Respond to the following message in English with a short, natural conversational response suitable for text-to-speech audio output.

Message: ${message}`;
  }

  const response = await hf.textGeneration({
    model: 'google/gemma-2b-it',
    inputs: prompt,
    parameters: {
      max_new_tokens: 200,
    },
  });

  return Response.json({ reply: response.generated_text });
}