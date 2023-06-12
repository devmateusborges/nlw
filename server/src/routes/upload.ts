import { randomUUID } from "node:crypto";
import { extname, resolve } from "node:path";
import { FastifyInstance } from "fastify";
import { createWriteStream } from "node:fs";
// permite eu aguardar o processo chegou ate o final
import { pipeline } from "node:stream";
// tranforma funções mais antigas que não tem promise para aceitar
import { promisify } from "node:util";

// aqui eu defino
const pump = promisify(pipeline);

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", async (request, reply) => {
    // recupera upload
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880, // 5mb
      },
    });

    if (!upload) {
      return reply.status(400).send();
    }
    // valida to tipo de arquivo
    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/;
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype);

    // se não for imagem ou video 400
    if (!isValidFileFormat) {
      return reply.status(400).send();
    }
    // cria novo uuid
    const fileId = randomUUID();
    // renomeia
    const extension = extname(upload.filename);
    // concatena com nome e o uuid
    const fileName = fileId.concat(extension);

    //
    const writeStream = createWriteStream(
      // padroniza o caminho cada sistema exemplo // ou \\
      resolve(__dirname, "..", "..", "uploads", fileName)
    );

    // verificar
    await pump(upload.file, writeStream);

    const fullUrl = request.protocol.concat("://").concat(request.hostname);
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString();

    return { fileUrl };
  });
}
