import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function userRoute(Fastify: FastifyInstance) {
  Fastify.get("/users/count", async () => {
    const count = await prisma.user.count();

    return {
      count,
    };
  });
}
