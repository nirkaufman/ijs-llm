import {MemoryVectorStore} from 'langchain/vectorstores/memory';
import {Document} from 'langchain/document';
import {OpenAIEmbeddings} from "@langchain/openai";

const candidates = [
  {id: 2, name: "Alice", bio: 'I am a javaScript developer'},
  {id: 2, name: "Bob", bio: 'I build apps with IOS'},
  {id: 2, name: "Ruth", bio: 'I use c++ everyday'},
]

const createStore = () => {
  return MemoryVectorStore.fromDocuments(
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
