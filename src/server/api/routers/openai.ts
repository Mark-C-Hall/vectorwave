import { z } from "zod";
import { OpenAI } from "openai";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const openaiRouter = createTRPCRouter({
  /**
   * Endpoint to generate a response from the Large Language Model (LLM) based on a conversation's context.
   * @param conversationId - The unique identifier for the conversation.
   * @returns An object containing the LLM's generated response.
   */
  generateLLMResponse: privateProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Retrieve the full conversation history from the database.
        const messages = await ctx.db.message.findMany({
          where: { conversationId: input.conversationId },
          orderBy: { createdAt: "asc" },
        });

        // Concatenate all messages to form a single prompt, labeled by sender.
        const prompt = messages.reduce((acc, message) => {
          const prefix = message.isFromUser ? "User:" : "";
          return acc + `${prefix} ${message.content}\n`;
        }, "");

        // Create an instance of the OpenAI API client.
        const openai = new OpenAI();

        // Query the OpenAI API with the assembled conversation history as the prompt.
        const completion = await openai.chat.completions.create({
          messages: [{ role: "system", content: prompt }],
          model: "gpt-3.5-turbo",
        });

        // Extract the response, ensuring it's a string and without the 'Bot:' prefix.
        let response = completion.choices[0]?.message?.content ?? "";
        if (response.startsWith("Bot:")) {
          response = response.substring(4).trimStart();
        }

        // Send back the LLM's response.
        return { response };
      } catch (error) {
        console.error("Error generating LLM response: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to generate response from OpenAI",
        });
      }
    }),
});
