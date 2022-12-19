import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import cors from "@fastify/cors";
import { poolRoutes } from "./routes/pool";
import { guessRoute } from "./routes/guess";
import { userRoute } from "./routes/user";

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(poolRoutes);

  await fastify.register(guessRoute);

  await fastify.register(userRoute);

  await fastify.listen({ port: 3333 /*  host: '0.0.0.0' */ });
}

bootstrap();
