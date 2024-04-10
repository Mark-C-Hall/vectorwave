import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, privateProcedure } from "../trpc";

export const documentRouter = createTRPCRouter({
  // Get all documents by user
  getDocumentsByUser: privateProcedure.query(async ({ ctx }) => {
    try {
      const documents = await ctx.db.document.findMany({
        where: {
          userId: ctx.userId,
        },
      });
      return documents;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to fetch documents",
      });
    }
  }),

  // Upload a file
  uploadFile: privateProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.db.document.create({
          data: {
            userId: ctx.userId,
            title: input.title,
            content: input.content,
          },
        });
      } catch (error) {
        console.error("Error uploading file: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to upload file",
        });
      }
    }),

  // Edit Document Title
  editDocument: privateProcedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.db.document.update({
          where: { id: input.id },
          data: { title: input.title },
        });
      } catch (error) {
        console.error("Error editing document: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to edit document",
        });
      }
    }),

  // Delete Document
  deleteDocument: privateProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.db.document.delete({ where: { id: input } });
      } catch (error) {
        console.error("Error deleting document: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to delete document",
        });
      }
    }),
});
