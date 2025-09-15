import { FastifyInstance } from 'fastify';
import pgp from 'pg-promise'
import pg from 'pg-promise/typescript/pg-subset';

let database: pgp.IDatabase<{}, pg.IClient>;

export async function connectDB(app: FastifyInstance) {
    const user = process.env.DB_USER
    const port = process.env.DB_PORT
    const name = process.env.DB_NAME
    const host = process.env.DB_HOST
    const pass = process.env.DB_PASS
    
    const cn = `postgres://${user}:${pass}@${host}:${port}/${name}`;
    let db = pgp({})(cn);
    try {
        await db.connect()
        database = db
    } catch (err) {    
        app.log.error(err)
        process.exit(1)
    }
}

export function getDB() : pgp.IDatabase<{}, pg.IClient> {
    return database
}