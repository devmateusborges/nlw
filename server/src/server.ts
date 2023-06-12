import "dotenv/config";

import fastify from "fastify";
import cors from "@fastify/cors";
import { memoriesRoutes } from "./routes/memories";
import { authRoutes } from "./routes/auth";
import multipart from "@fastify/multipart";
import jwt from "@fastify/jwt";
import { uploadRoutes } from "./routes/upload";
import { resolve } from "path";

const app = fastify();

app.register(cors, {
  origin: true,
});

app.register(multipart);

// deixa pasta statica
app.register(require("@fastify/static"), {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads",
});

// TODO para ultilizar  @fastify/jwt
app.register(jwt, {
  // TODO ALTERAR  secret: "spacetime"
  secret: "spacetime",
});

app.register(authRoutes);
app.register(uploadRoutes);
app.register(memoriesRoutes);

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("🚀 HTTP server running on port http://localhost:3333");
  });
