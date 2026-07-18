import { server } from './server';
import { setup as setupDb } from './db_setup';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = '0.0.0.0';

async function start() {
  try {
    // 1. Initialize database configurations & setup schemas
    await setupDb();

    // 2. Start fastify web server listener
    await server.listen({ port: PORT, host: HOST });
    console.log(`\n======================================================`);
    console.log(`MODULE 0: DATA INTAKE ENGINE RUNNING ON http://localhost:${PORT}`);
    console.log(`Ready to parse Invoices, POs, Ledgers, and CSV bank sheets.`);
    console.log(`======================================================\n`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
