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
          keywords: "",
          transcript: "",
          userId: ctx.session.user.id,
        },
      });
      //TODO: Get keywords;

      await ctx.prisma.note.create({
        data: {
          content: "",
          nodeWordMapping: "",
          lectureId: res.id,
        },
      });

      return ctx.prisma.lecture.findUnique({
        where: {
          id: res.id,
        },
      });
    }),
});
