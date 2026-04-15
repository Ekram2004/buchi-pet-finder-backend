import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";


import { prisma } from "./lib/prisma";

// Infrastructure Layer
import { PrismaPetRepository } from "./infrastructure/database/repositories/PrismaPetRepository";
import { PrismaCustomerRepository } from "./infrastructure/database/repositories/PrismaCustomerRepository";
import { PrismaAdoptionRepository } from "./infrastructure/database/repositories/PrismaAdoptionRepository";
import { PetFinderService } from "./infrastructure/external-api/PetFinderService";
import { FileStorageService } from "./infrastructure/services/FileService";

// Application Layer (Use Cases)
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
  // 1. Register Core Plugins
  await server.register(cors);

  // Register multipart to support file streams in the Controller
  await server.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  });

  
  server.register(fastifyStatic, {
    root: path.join(process.cwd(), "uploads"),
    prefix: "/uploads/",
  });

  // 2. Initialize Infrastructure
  const petRepo = new PrismaPetRepository();
  const customerRepo = new PrismaCustomerRepository();
  const adoptionRepo = new PrismaAdoptionRepository();
  const petFinder = new PetFinderService();
  const fileService = new FileStorageService(); // Updated name

  // 3. Initialize Use Cases (Dependency Injection)
  const createPetUseCase = new CreatePetUseCase(petRepo, fileService);
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

  // 4. Register Routes

  server.register(petRoutes, {
    createPetUseCase,
    getPetsUseCase,
    fileService, 
  });

  server.register(customerRoutes, {
    addcustomerUseCase,
  });

  server.register(adoptionRoutes, {
    adoptPetUseCase: adoptUseCase,
    getRequestsUseCase,
    generateReportUseCase,
  });

  // Health Check
  server.get("/health", async () => ({ status: "OK", timestamp: new Date() }));

  // 5. Start Server
  try {
    await prisma.$connect();
    server.log.info("Database connected successfully");

    const port = Number(process.env.PORT) || 3000;
    const address = await server.listen({
      port: port,
      host: "0.0.0.0", // Required for Docker
    });

    server.log.info(`Buchi Backend is running at ${address}`);
  } catch (err) {
    server.log.error(err, "Error starting server or connecting to DB");
    process.exit(1);
  }
}

// Graceful Shutdown
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
