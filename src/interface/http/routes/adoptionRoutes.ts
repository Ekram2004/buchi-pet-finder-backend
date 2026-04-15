import { FastifyInstance } from "fastify";
import { AdoptionController } from "../controllers/AdoptionController";

export async function adoptionRoutes(fastify: FastifyInstance, options: any) {
  const { adoptPetUseCase, getRequestsUseCase, generateReportUseCase } = options;
  
    const controller = new AdoptionController(
      adoptPetUseCase,
      getRequestsUseCase,
      generateReportUseCase
    );
    fastify.post('/adopt', controller.adopt.bind(controller));
  fastify.get(
    "/get_adoption_requests",
    controller.getRequests.bind(controller),
  );
  
  // BOUNS ENDPOINT
  fastify.post("/generate_report", controller.generateReport.bind(controller));
}