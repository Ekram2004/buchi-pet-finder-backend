import Fastify, { fastify } from 'fastify';
import sensible from '@fastify/sensible';
import cors from '@fastify/cors';
import { prisma } from './lib/prisma';
import { request } from 'node:http';


const server = fastify({
    logger: true,
});


server.register(sensible);
server.register(cors, {
    origin: '*',
});


// Basic route
server.get('/', async (request, reply) => {
    return { hello: 'Buchi Pet Finder Backend is running ' }
});


server.get("/db-check", async (request, reply) => {
  try {
    // A simple query to check if the DB is reachable
    await prisma.$queryRaw`SELECT 1`;
    return { status: "success", message: "Database connection successful!" };
  } catch (error) {
    server.log.error(error);
    reply.send({ status: "error", message: "Database connection failed." });
  }
});


const start = async () => {

    try {
        await server.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
        const address = server.server.address();
        server.log.info(`Server listening on ${typeof address === 'string' ? address : address?.address + ':' + address?.port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    };
}

    start();
   process.on('SIGINT', async () => {
      await prisma.$disconnect();
      await server.close();
      process.exit(0);
    });