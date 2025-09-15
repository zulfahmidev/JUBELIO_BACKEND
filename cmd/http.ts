import Fastify from 'fastify'
import InitDependencies from './wire'
import * as dotenv from "dotenv";
import { connectDB } from '../pkg/database/database';
import multipart from "@fastify/multipart";

const app = Fastify({
    logger: true
})


const start = async () => {
    
    await app.register(multipart, {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
      },
    });
    
    dotenv.config();
    connectDB(app)
    InitDependencies(app)

    const PORT = Number(process.env.PORT) ?? 8080
    
    try {
        await app.listen({ port: PORT })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()