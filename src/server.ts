import Fastify from 'fastify';
import { petRoutes } from './interface/http/routes/petRoutes';
import { prisma } from './lib/prisma';

const server = Fastify({ logger: true });


async function start() {
  server.register(petRoutes, { prefix: "/api/pets" });

  try {
    await prisma.$connect();
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    process.exit(1);
  }
}

start();