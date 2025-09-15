import Fastify from 'fastify'
import InitDependencies from './wire'
import * as dotenv from "dotenv";
import { connectDB } from '../pkg/database/database';

const app = Fastify({
    logger: true
})

const start = async () => {
    
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