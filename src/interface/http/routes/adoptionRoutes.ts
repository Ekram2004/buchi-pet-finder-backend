import { FastifyInstance } from "fastify";
import { AdoptionController } from "../controllers/AdoptionController";

export async function adoptionRoutes(fastify: FastifyInstance, options: any) {
    const { adoptPetUseCase, getRequestsUseCase } = options;
    const controller = new AdoptionController(
      adoptPetUseCase,
      getRequestsUseCase,
    );
    fastify.post('/', controller.adopt.bind(controller));
    fastify.get("/", controller.getRequests.bind(controller));
}