import {MemoryVectorStore} from 'langchain/vectorstores/memory';
import {OpenAIEmbeddings} from "@langchain/openai";
import {PDFLoader} from '@langchain/community/document_loaders/fs/pdf';
import {DirectoryLoader} from 'langchain/document_loaders/fs/directory';
import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters';
import * as path from 'path';
import OpenAI from "openai";

// config
const dir = path.join(process.cwd(), 'server', 'uploads');
const openAi = new OpenAI();

// RAG --> LOAD STEP
// create a loader for the directory and map
// pdf files to the PDFLoader
const directoryLoader = new DirectoryLoader(
    dir,
    {
      ".pdf": (path: string) => new PDFLoader(path),
    }
);

// RAG --> SPLIT STEP
// create a splitter to split the text into chunks
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 100,
});


const loadDocs = async () => {
  return await directoryLoader.load();
}

const splitDocs = async () => {
  const docs = await loadDocs();
  return await textSplitter.splitDocuments(docs);
}

// we will use the MemoryVectorStore to store the documents
// and the OpenAIEmbeddings to vectorized the text
const loadStore = async () => {
  const docs = await splitDocs();
  return MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings())
}

export const docQuery = async (userPrompt: string) => {
  const store = await loadStore();
  const results = await store.similaritySearch(userPrompt, 1);

  const response = await openAi.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'assistant',
        content:
          `
            You are a helpful AI HR assistant. Answer questions to your best ability.
            Your answer should be based on the provided context. If you can't find the answer,
            Don't worry! Just say "I cant answer". Don't made up anything.
          `,
      },
      {
        role: 'user',
        content: `        
          Question: ${userPrompt}
          Context: ${results.map((r) => r.pageContent).join('\n')}
        `,
      }
    ],
  });

  return {
    answer: response.choices[0].message.content,
    sources: results.map((r) => r.metadata['source']),
  }

}


