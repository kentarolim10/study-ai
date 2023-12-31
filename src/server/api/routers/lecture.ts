import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  type SerializedEditorState,
  type SerializedLexicalNode,
} from "lexical";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import getKeywords from "~/server/keywords";

const keywordSchema = z.record(z.number());
const transcriptSchema = z
  .object({
    id: z.string(),
    word: z.string(),
    importance: z.number(),
  })
  .array();
const noteSchema = z.record(z.number());

export const lectureRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const lectures = await ctx.prisma.lecture.findMany({
      select: {
        id: true,
        class: true,
      },
    });

    return lectures;
  }),

  createLecture: protectedProcedure
    .input(z.object({ className: z.string(), topic: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.lecture.create({
        data: {
          class: input.className,
          topic: input.topic,
          keywords: {},
          transcript: [],
          userId: ctx.session.user.id,
        },
      });
      console.log("getting keywords");
      const keywords = await getKeywords(input.topic);
      console.log("after");
      await ctx.prisma.lecture.update({
        where: {
          id: res.id,
        },
        data: {
          keywords: keywords,
        },
      });

      const note = await ctx.prisma.note.create({
        data: {
          nodeWordMapping: {},
          lectureId: res.id,
        },
      });

      return { ...res, note };
    }),

  getLecture: protectedProcedure
    .input(z.object({ lectureId: z.string() }))
    .query(async ({ ctx, input }) => {
      const lecture = await ctx.prisma.lecture.findUnique({
        where: {
          id: input.lectureId,
        },
        include: {
          note: true,
        },
      });

      if (!lecture) {
        return null;
      }

      const transcript = transcriptSchema.safeParse(lecture.transcript);
      if (!transcript.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid transcipt format",
        });
      }

      if (!lecture.note) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No note found",
        });
      }

      const keywords = keywordSchema.safeParse(lecture.keywords);
      if (!keywords.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid keywords format",
        });
      }

      const nodeIdToWord = noteSchema.safeParse(lecture.note.nodeWordMapping);
      if (!nodeIdToWord.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid nodeWordMapping format",
        });
      }

      return {
        ...lecture,
        nodeIdToWord: new Map(Object.entries(nodeIdToWord.data)),
        keywords: keywords.data,
        transcript: transcript.data,
        // IDK why type isn't showing null but it can be null
        editorState: lecture.note.content
          ? (lecture.note
              .content as unknown as SerializedEditorState<SerializedLexicalNode>)
          : null,
      };
    }),

  save: protectedProcedure
    .input(
      z.object({
        lectureId: z.string(),
        transcript: transcriptSchema,
        editorState: z.record(z.any()),
        nodeIdToWord: z.map(z.string(), z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const nodeIdToWord = Object.fromEntries(input.nodeIdToWord.entries());
      await ctx.prisma.lecture.update({
        where: {
          id: input.lectureId,
        },
        data: {
          transcript: input.transcript,
          note: {
            update: {
              content: input.editorState,
              nodeWordMapping: nodeIdToWord,
            },
          },
        },
      });
    }),

  getFillerWords: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.fillerWord.findMany();
  }),

  addFillerWords: protectedProcedure
    .input(z.string().array())
    .mutation(async ({ ctx, input }) => {
      const fillerWords: { word: string }[] = [];
      input.forEach((fillerword) => {
        fillerWords.push({
          word: fillerword,
        });
      });
      await ctx.prisma.fillerWord.createMany({
        data: fillerWords,
        skipDuplicates: true,
      });
    }),
});
