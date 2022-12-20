import fastify, { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export async function authRoutes(Fastify: FastifyInstance) {
  Fastify.get("/me", async (request) => {
    await request.jwtVerify();

    return { user: request.user };
  });

  Fastify.post("/users", async (request) => {
    const createUserBody = z.object({
      acess_token: z.string(),
    });

    const { acess_token } = createUserBody.parse(request);

    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${acess_token}`,
        },
      }
    );

    const userData = await userResponse.json();

    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url(),
    });

    const userInfo = userInfoSchema.parse(userData);

    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          avatarUrl: userInfo.picture,
        },
      });
    }

    const token = Fastify.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        // who generates the token
        sub: user.id,
        expiresIn: "7 days",
      }
    );

    return {
      token,
    };
  });
}
