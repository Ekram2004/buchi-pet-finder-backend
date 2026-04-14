import { FastifyInstance } from "fastify";
import { AdoptionController } from "../controllers/AdoptionController";

export async function adoptionRoutes(fastify: FastifyInstance, options: any) {
    const { adoptPetUseCase } = options;
    const controller = new AdoptionController(adoptPetUseCase);
    fastify.post('/', controller.adopt.bind(controller));
}