import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_TOKEN);

export async function POST(req: Request) {
  try {
    const { message, mode } = await req.json();

    let prompt = '';
    if (mode === 'grammar') {
      prompt = `You are an English teacher. First, correct any grammatical mistakes in the following message and provide the corrected version. Then, respond to the message in English as if you were having a conversation. Format your response as follows:

**Correction:** [Corrected version of the message, if there are mistakes. If there are no mistakes, say "No corrections needed."]
**Response:** [Your conversational response.]

Message: ${message}`;
    } else if (mode === 'conversation') {
      prompt = `You are a friendly English conversation partner. Your goal is to have a natural, engaging, and simple conversation in English, as if you were chatting with a friend who is learning English. Respond to the following message in a short, friendly, and conversational way (1-2 sentences). Always try to keep the conversation going by asking a question or making a relevant comment. Use simple English to make it easy to understand.

Message: ${message}`;
    } else if (mode === 'listening') {
      prompt = `You are an English teacher helping with listening practice. Respond to the following message in English with a short conversational response (1-2 sentences). The response should be clear, simple, and suitable for text-to-speech audio output.

Message: ${message}`;
    } else if (mode === 'voice') {
      prompt = `You are an English teacher helping with voice-only conversation practice. Respond to the following message in English with a short, natural conversational response (1-2 sentences) suitable for text-to-speech audio output.

Message: ${message}`;
    }

    // Usar o modelo BlenderBot para conversas mais naturais
    const response = await hf.textGeneration({
      model: 'facebook/blenderbot-400M-distill',
      inputs: prompt,
      parameters: {
        max_new_tokens: 30, // Respostas mais curtas para evitar repetição
        temperature: 0.6, // Para respostas mais coerentes e menos aleatórias
        top_p: 0.9,
      },
    });

    let reply = response.generated_text;

    // Processar a resposta para remover o prompt e retornar apenas a parte relevante
    if (mode === 'grammar') {
      const correctionStart = reply.indexOf('**Correction:**');
      if (correctionStart !== -1) {
        reply = reply.substring(correctionStart); // Pega a partir de **Correction:**
      }
    } else if (mode === 'conversation' || mode === 'listening' || mode === 'voice') {
      const messageStart = reply.indexOf('Message:');
      if (messageStart !== -1) {
        reply = reply.substring(messageStart + 8 + message.length).trim(); // Remove o prompt até o final do "Message: ${message}"
        reply = reply.split('\n').filter(line => line.trim() && !line.startsWith('Message:')).join('\n').trim();
      }
    }

    return Response.json({ reply });
  } catch (error) {
    console.error('Error in API route:', error);
    return Response.json({ reply: 'Sorry, something went wrong. Let’s try again!' }, { status: 500 });
  }
}