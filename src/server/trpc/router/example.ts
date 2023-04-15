import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const exampleRouter = router({
  getPost: publicProcedure.input(z.number()).query(({ input, ctx }) => {
    return ctx.prisma.post.findUniqueOrThrow({ where: { id: input } });
  }),
});
