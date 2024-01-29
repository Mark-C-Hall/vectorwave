import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserByAuthId: publicProcedure
    .input(z.object({ authId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.user.findUnique({
        where: {
          authId: input.authId,
        },
      });
    }),
});
