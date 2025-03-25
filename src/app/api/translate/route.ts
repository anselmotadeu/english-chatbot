export async function POST(req: Request) {
    try {
      const { text } = await req.json();
  
      // Adicionar um e-mail para melhorar a qualidade da tradução (opcional)
      const email = 'seu-email@example.com'; // Substitua pelo seu e-mail
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt&de=${email}`
      );
      const data = await response.json();
  
      if (data.responseStatus !== 200) {
        throw new Error('Erro ao traduzir: ' + data.responseDetails);
      }
  
      const translation = data.responseData.translatedText;
      return Response.json({ translation });
    } catch (error) {
      console.error('Error in translation API:', error);
      return Response.json({ translation: 'Erro ao traduzir.' }, { status: 500 });
    }
  }