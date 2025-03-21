import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_TOKEN);

export async function POST(req: Request) {
  const { message } = await req.json();
  const prompt = `You are an English teacher. Respond to this in English and correct any mistakes: ${message}`;
  const response = await hf.textGeneration({
    model: 'google/gemma-2b-it', // Modelo corrigido
    inputs: prompt,
    parameters: {
      max_new_tokens: 200, // Ajustado para o formato correto
    },
  });
  return Response.json({ reply: response.generated_text });
}