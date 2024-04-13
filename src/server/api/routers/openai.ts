import { z } from "zod";
import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

interface PineconeEmbedding {
  id: string;
  values: number[];
  metadata: Record<string, string>;
}

export const openaiRouter = createTRPCRouter({
  // Generate a response from the LLM based on conversation context
  generateLLMResponse: privateProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const messages = await ctx.db.message.findMany({
          where: { conversationId: input.conversationId },
          orderBy: { createdAt: "asc" },
        });

        const prompt = messages.reduce((acc, message) => {
          const prefix = message.isFromUser ? "User:" : "";
          return acc + `${prefix} ${message.content}\n`;
        }, "");

        const openai = new OpenAI();

        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content:
                "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. If the user has submitted additional context which is notated by 'Attached file' or 'vector results' then the assistant will use this context to answer the question. If the answer to the question cannot be found in the provided context, respond with 'I don't know.' If the user has not submitted any additional context, the assistant will generate a response based on the conversation history.",
            },
            { role: "user", content: prompt },
          ],
          model: "gpt-3.5-turbo",
        });

        let response = completion.choices[0]?.message?.content ?? "";
        if (response.startsWith("Bot:")) {
          response = response.substring(4).trimStart();
        }

        return { response };
      } catch (error) {
        console.error("Error generating LLM response: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to generate response from OpenAI",
        });
      }
    }),

  // Get vector embeddings for a query
  embedQuery: privateProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input }) => {
      const openai = new OpenAI();

      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: input.content,
      });

      return response.data[0]?.embedding ?? [];
    }),

  // Get vector embeddings for a file
  embedFile: privateProcedure
    .input(
      z.object({
        docId: z.string(),
        text: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const openai = new OpenAI();
      const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
      });

      const paragraphs = input.text.split("\n").filter((p) => p.trim() !== "");
      const embeddings: PineconeEmbedding[] = [];

      await Promise.all(
        paragraphs.map(async (paragraph, i) => {
          try {
            const response = await openai.embeddings.create({
              model: "text-embedding-3-small",
              input: paragraph,
            });
            embeddings.push({
              id: `${input.docId}:chunk${i}`,
              values: response.data[0]?.embedding ?? [],
              metadata: { text: paragraph },
            });
          } catch (error) {
            console.error("Error getting embeddings: ", error);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Unable to get embeddings",
            });
          }
        }),
      );

      const index = pc.Index("vectorwave");
      try {
        await index.namespace(ctx.userId).upsert(embeddings);
      } catch (error) {
        console.error("Error upserting embeddings: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to upsert embeddings",
        });
      }
    }),

  // Remove vector embeddings for a document
  removeEmbeddings: privateProcedure
    .input(z.object({ docId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
      });
      const index = pc.Index("vectorwave");
      try {
        const results = await index
          .namespace(ctx.userId)
          .listPaginated({ prefix: input.docId });
        const ids = results.vectors?.map((v) => v.id) ?? [];
        await index.namespace(ctx.userId).deleteMany(ids);
      } catch (error) {
        console.error("Error deleting embeddings: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to delete embeddings",
        });
      }
    }),

  // Get top k results from the embeddings index
  getTopResults: privateProcedure
    .input(
      z.object({
        vector: z.array(z.number()),
        topK: z.number().min(1).max(10).default(3),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
      });
      const index = pc.Index("vectorwave");
      try {
        const results = await index.namespace(ctx.userId).query({
          vector: input.vector,
          topK: input.topK,
          includeMetadata: true,
        });
        return results.matches?.map((match) => match.metadata?.text) ?? [];
      } catch (error) {
        console.error("Error querying embeddings: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to query embeddings",
        });
      }
    }),
});
