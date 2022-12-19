import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import ShortUniQueId from "short-unique-id";

export async function poolRoutes(Fastify: FastifyInstance) {
  Fastify.get("/pools/count", async () => {
    const count = await prisma.pool.count();

    return {
      count,
    };
  });

  Fastify.post("/pools", async (request, reply) => {
    const createPoolBody = z.object({
      title: z.string(),
    });

    const { title } = createPoolBody.parse(request.body);

    const generate = new ShortUniQueId({ length: 6 });
    const code = String(generate()).toUpperCase();

    await prisma.pool.create({
      data: {
        title,
        code,
      },
    });

    return reply.status(201).send({ code });
  });
}
