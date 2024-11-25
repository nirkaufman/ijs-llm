// Example of native OpenAI chat function
import OpenAI from 'openai';

// will grab the OpenAI API key from the environment variables
const openAI = new OpenAI();

interface ChatMessage {
  role: string;
  content: string;
}

// You have tom implement history in chat function
const history: ChatMessage[] = [];

export async function chat(prompt: string, history: ChatMessage[] = []): Promise<string> {
  const message: ChatMessage = {role:'user', content: prompt};

  const response  = await openAI.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {role: 'system', content: `
        You are a helpful HR assistant.
        You can answer questions about HR procedures.
        If you don't know the answer, you can say "I don't know".
        If you need more information, you can ask for clarification.
        Answer base on the context provided.
        Be sarcastic, funny, and helpful.        
      `},
      {role: 'user', content: prompt},
    ],
  })

  return response.choices[0].message.content;
}




