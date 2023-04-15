import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "../../../env/server.mjs";
import { createContext } from "../../../server/trpc/context";
import { appRouter } from "../../../server/trpc/router/_app";
// import { Prisma } from "@prisma/client";
// import { TRPCError } from "@trpc/server";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error, path }) {
    // if (
    //   error.cause &&
    //   error.cause instanceof Prisma.PrismaClientKnownRequestError
    // )
    //   if (error.cause.code === "P2025") {
    //     throw new TRPCError({
    //       code: "NOT_FOUND",
    //       message: "Not found",
    //     });
    //   }

    if (env.NODE_ENV === "development") {
      console.error(`❌ tRPC failed on ${path}: ${error}`);
    }

    //   : undefined,
  },
});
