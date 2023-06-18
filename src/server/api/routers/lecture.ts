import { TRPCError } from "@trpc/server";
import {
  EditorState,
  SerializedEditorState,
  SerializedLexicalNode,
} from "lexical";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { Note } from "@prisma/client";

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
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  createLecture: protectedProcedure
    .input(z.object({ className: z.string(), titleName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.lecture.create({
        data: {
          class: input.className,
          title: input.titleName,
          keywords: {},
          transcript: [],
          userId: ctx.session.user.id,
        },
      });
      //TODO: Get keywords;

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
});
