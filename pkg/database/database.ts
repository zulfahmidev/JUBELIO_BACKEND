import { FastifyInstance } from 'fastify';
import pgp from 'pg-promise'
import pg from 'pg-promise/typescript/pg-subset';

let database: pgp.IDatabase<{}, pg.IClient>;

export async function connectDB(app: FastifyInstance) {
    let db = pgp({})(process.env.DATABASE_URL ?? '');
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