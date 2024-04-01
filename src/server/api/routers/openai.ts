import { z } from "zod";
import { OpenAI } from "openai";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const openaiRouter = createTRPCRouter({
  hello: privateProcedure
    .input(
      z.object({
        prompt: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const openai = new OpenAI();
        const completion = await openai.chat.completions.create({
          messages: [{ role: "system", content: input.prompt }],
          model: "gpt-3.5-turbo",
        });

        return {
          response: completion.choices[0]?.message?.content,
        };
      } catch (error) {
        console.error("Error invoking OpenAI API:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to generate response from OpenAI",
        });
      }
    }),
});
