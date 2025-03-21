import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_TOKEN);

export async function POST(req: Request) {
  const { message } = await req.json();
  const prompt = `You are an English teacher. Respond to this in English and correct any mistakes: ${message}`;
  const response = await hf.textGeneration({
    model: 'google/gemma-1b',
    inputs: prompt,
    max_length: 200,
  });
  return Response.json({ reply: response.generated_text });
}