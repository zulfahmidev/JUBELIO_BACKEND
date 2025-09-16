import { MultipartFile } from "@fastify/multipart";
import { randomUUID } from "crypto";
import { createWriteStream, promises, WriteStream } from "fs";
import path from "path";
import { app } from "../../cmd/http";

export default async function UploadFile(data: MultipartFile) : Promise<string | null> {
    if (data) {
        const ext = path.extname(data.filename);
        const filename = randomUUID() + ext;
        const dir = "uploads"
        const uploadPath = path.join(process.cwd(), `public/${dir}`, filename);
        await promises.mkdir(path.dirname(uploadPath), { recursive: true });
        await pumpStream(data.file, createWriteStream(uploadPath));

        let host = ''
        const address = app.server.address()
        if (!(typeof address === "string" || address === null)) {
          host = address.address === "::1" ? `http://127.0.0.1:${process.env.PORT}` : address.address
        }
        return `${host}/${dir}/${filename}`
    }
    return null
}

async function pumpStream(input: NodeJS.ReadableStream, output: WriteStream) {
  return new Promise<void>((resolve, reject) => {
    input.pipe(output);
    output.on("finish", resolve);
    output.on("error", reject);
  });
}
