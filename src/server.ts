import Fastify from "fastify";
import cors from "@fastify/cors";
import {prisma} from "./lib/prisma";


import { PrismaPetRepository } from "./infrastructure/database/repositories/PrismaPetRepository";
import { PrismaCustomerRepository } from "./infrastructure/database/repositories/PrismaCustomerRepository";
import { PrismaAdoptionRepository } from "./infrastructure/database/repositories/PrismaAdoptionRepository";
import { PetFinderService } from "./infrastructure/external-api/PetFinderService";



import { CreatePetUseCase } from "./application/use-cases/pet/CreatePetUseCase";
import { GetPetsUseCase } from "./application/use-cases/pet/GetPetsUseCase";
import { AddCustomerUseCase } from "./application/use-cases/customer/AddCustomerUseCase";
import { AdoptPetUseCase } from "./application/use-cases/adoption/AdoptionPetUseCase";
import { GetAdoptionRequestUseCase } from "./application/use-cases/adoption/GetAdoptionRequestUseCase";
import { GenerateReportUseCase } from "./application/use-cases/adoption/GenerateReportUseCase";


import { petRoutes } from "./interface/http/routes/petRoutes";
import { customerRoutes } from "./interface/http/routes/customerRoutes";
import { adoptionRoutes } from "./interface/http/routes/adoptionRoutes";



const server = Fastify({
  logger: { transport: { target: "pino-pretty" } },
  ignoreTrailingSlash: true,
});

async function bootstrap() {
  await server.register(cors);

  
  const petRepo = new PrismaPetRepository();
  const customerRepo = new PrismaCustomerRepository();
  const adoptionRepo = new PrismaAdoptionRepository();
  const petFinder = new PetFinderService();

  const createPetUseCase = new CreatePetUseCase(petRepo);
  const getPetsUseCase = new GetPetsUseCase(petRepo, petFinder);
  const addcustomerUseCase = new AddCustomerUseCase(customerRepo);
  const adoptUseCase = new AdoptPetUseCase(
    adoptionRepo,
    petRepo,
    customerRepo,
    petFinder,
  );
  
  const getRequestsUseCase = new GetAdoptionRequestUseCase(adoptionRepo);
  const generateReportUseCase = new GenerateReportUseCase(adoptionRepo);

  


   server.register(petRoutes, {
    prefix: "/api/pets",
    createPetUseCase,
    getPetsUseCase,
  });

  server.register(customerRoutes, {
    prefix: "/api/customers",
    addcustomerUseCase
  });

  server.register(adoptionRoutes, {
    prefix: "/api/adoptions",
    adoptPetUseCase: adoptUseCase,
    getRequestsUseCase,
    generateReportUseCase
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
