import { OpenAIEmbeddings } from "@langchain/openai";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

const NEON_CONNECTION_STRING = process.env.DATABASE_URL;

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large",
});

const config = {
  postgresConnectionOptions: {
    connectionString: NEON_CONNECTION_STRING,
    ssl: true,
  },
  tableName: "langchain_pg_embedding",
  columns: {
    idColumnName: "id",
    vectorColumnName: "embedding",
    contentColumnName: "document",
    metadataColumnName: "cmetadata",
  },
};

const vectorStorePromise = PGVectorStore.initialize(embeddings, config)
  .then((store) => {
    console.log("VectorStore initialized successfully.");
    return store;
  })
  .catch((error) => {
    console.error("Error initializing VectorStore:", error);
    throw new Error("Failed to initialize vector store");
  });

const searchDocuments = async (query) => {
  try {
    const vectorStore = await vectorStorePromise;
    const retriever = vectorStore.asRetriever({
      k: 10,
      searchType: "similarity",
    });
    const documents = await retriever.invoke(query);
    return documents;
  } catch (error) {
    console.error("Error searching documents:", error);
    throw error;
  }
};

export async function POST(req) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: `You are an assistant with tool-calling capabilities for question-answering tasks. Always use your tools to answer the question. If you don't know the answer, just say that you don't know. Keep the answer concise, and provide sources and APA citations if possible.`,
    messages,
    temperature: 0,
    tools: {
      retriveSources: tool({
        description:
          "Search and retrieve documents related to the query from your knowledge base",
        parameters: z.object({
          question: z.string().describe("The user's query"),
        }),
        execute: async ({ question }) => searchDocuments(question),
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
