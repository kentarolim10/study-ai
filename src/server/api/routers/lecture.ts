import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

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
          keywords: "{}",
          transcript: "[]",
          userId: ctx.session.user.id,
        },
      });
      //TODO: Get keywords;

      const note = await ctx.prisma.note.create({
        data: {
          content: "[]",
          nodeWordMapping: "{}",
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

      const transcript = transcriptSchema.safeParse(
        JSON.parse(lecture.transcript?.toString() ?? "[]") as unknown
      );
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

      const keywords = keywordSchema.safeParse(
        JSON.parse(lecture.keywords?.toString() ?? "{}") as unknown
      );
      if (!keywords.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid keywords format",
        });
      }

      return {
        ...lecture,
        note: lecture.note,
        keywords: keywords.data,
        transcript: transcript.data,
      };
    }),
});

const keywordSchema = z.record(z.number());
const transcriptSchema = z
  .object({
    id: z.string(),
    word: z.string(),
    importance: z.number(),
  })
  .array();
