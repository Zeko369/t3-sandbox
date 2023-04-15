import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import { type Context } from "./context";
import { Prisma } from "@prisma/client";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

const prismaNotFoundMiddleware = t.middleware(({ next }) => {
  try {
    return next();
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Not found",
        });
      }
    }

    throw err;
  }
});

const baseProcedure = t.procedure.use(prismaNotFoundMiddleware);

/**
 * Unprotected procedure
 **/
export const publicProcedure = baseProcedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected procedure
 **/
export const protectedProcedure = baseProcedure.use(isAuthed);
