import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const exampleRouter = router({
  getPost: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    return await ctx.prisma.post.findUniqueOrThrow({ where: { id: input } });
  }),
});
