import OpenAI from 'openai';

// will grab the OpenAI API key from the environment variables
const openAI = new OpenAI();

interface ChatMessage {
  role: string;
  content: string;
}

export async function chat(prompt: string) {
  const message: ChatMessage = {role:'user', content: prompt};

  const response  = await openAI.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {role: 'system', content: 'You are a helpful HR assistant.'},
      message,
    ],
  })

  return response.choices[0].message.content;
}




