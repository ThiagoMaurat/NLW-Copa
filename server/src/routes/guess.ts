import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function guessRoute(Fastify: FastifyInstance) {
  Fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();

    return {
      count,
    };
  });
}
