import "@fastify/jwt";

declare module "@fastify/jwt" {
  // TODO INformaçoes para usar jwt fastify
  export interface FastifyJWT {
    user: {
      sub: string;
      name: string;
      avatarUrl: string;
    };
  }
}
