import {MemoryVectorStore} from 'langchain/vectorstores/memory';
import {Document} from 'langchain/document';
import {OpenAIEmbeddings} from "@langchain/openai";
import {Candidate, PrismaClient} from '@prisma/client'

// Example of how to connect to a database with prisma client
const db = new PrismaClient();

const createStore = async () => {
  const candidates: Candidate[] = await db.candidate.findMany();
  const store = MemoryVectorStore;

  return store.fromDocuments(
      candidates.map((candidate) => new Document({
        pageContent: ` ${candidate.bio}`,
        metadata: {name: candidate.name},
      })),
      new OpenAIEmbeddings()
  )
}

export async function search(query: string) {
 const store = await createStore();
 return store.similaritySearch(query, 1);
}
