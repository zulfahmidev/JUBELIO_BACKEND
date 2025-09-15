export default {
  migrationFileExtension: 'ts', 
  dir: 'migrations',
  direction: 'up',
  logFileName: 'migrations.log',
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  }
};
