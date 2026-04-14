import { FastifyReply, FastifyRequest } from "fastify";
import { AdoptPetUseCase } from "../../../application/use-cases/adoption/AdoptionPetUseCase";

export class AdoptionController {
    constructor( private adoptPetUseCase: AdoptPetUseCase)
    { }
    
    async adopt(request: FastifyRequest, reply: FastifyReply) {
        try { 
            const { customer_id, pet_id } = request.body as any;

            const adoption = await this.adoptPetUseCase.execute(customer_id, pet_id);

            return reply.status(201).send({
                status: 'success',
                adoption_id: adoption.id
            });
        } catch (error: any) {
            const statusCode = error.message.includes('not found') ? 404 : 500;
            return reply.status(statusCode).send({ status: 'error', message: error.message });
        }
    }
}