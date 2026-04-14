import Fastify from "fastify";
import cors from "@fastify/cors";
import {prisma} from "./lib/prisma";
import { petRoutes } from "./interface/http/routes/petRoutes";


import { PrismaPetRepository } from "./infrastructure/database/repositories/PrismaPetRepository";
import { PetFinderService } from "./infrastructure/external-api/PetFinderService";


import { CreatePetUseCase } from "./application/use-cases/pet/CreatePetUseCase";
import { GetPetsUseCase } from "./application/use-cases/pet/GetPetsUseCase";

const server = Fastify({
  logger: {
    transport: { target: "pino-pretty" },
  },
});

async function bootstrap() {
  await server.register(cors);

  
  const petRepo = new PrismaPetRepository();
  const petFinder = new PetFinderService();

  const createPetUseCase = new CreatePetUseCase(petRepo);
  const getPetsUseCase = new GetPetsUseCase(petRepo, petFinder);

  
  await server.register(petRoutes, {
    prefix: "/api/pets",
    createPetUseCase,
    getPetsUseCase,
  });

  
  server.get("/health", async () => ({ status: "OK", timestamp: new Date() }));

  
  try {
    await prisma.$connect();
    server.log.info("Database connected successfully");
    const address = await server.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0",
    });
    server.log.info(`Buchi Backend is running at ${address}`);
  } catch (err) {
    server.log.error(err, "Error starting server or connecting to DB");
    process.exit(1);
  }
}

// Handle Graceful Shutdown
const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
signals.forEach((signal) => {
  process.on(signal, async () => {
    server.log.info(`Received ${signal}, closing server...`);
    await server.close();
    await prisma.$disconnect();
    process.exit(0);
  });
});

bootstrap();
