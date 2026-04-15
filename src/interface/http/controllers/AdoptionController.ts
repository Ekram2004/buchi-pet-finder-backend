import { FastifyReply, FastifyRequest } from "fastify";
import { AdoptPetUseCase } from "../../../application/use-cases/adoption/AdoptionPetUseCase";
import { GetAdoptionRequestUseCase } from "../../../application/use-cases/adoption/GetAdoptionRequestUseCase";
import { GenerateReportUseCase } from "../../../application/use-cases/adoption/GenerateReportUseCase";

export class AdoptionController {
    constructor(
        private adoptPetUseCase: AdoptPetUseCase,
        private getRequestUseCase:GetAdoptionRequestUseCase,
        private generateReportUseCase: GenerateReportUseCase
    )
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

    async getRequests(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { from_date, to_date } = request.query as any;

            if (!from_date || !to_date) {
                return reply.status(400).send({ status: 'error', message: 'from_date to to_data are required' });
            }

            const data = await this.getRequestUseCase.execute(from_date, to_date);
            return reply.status(200).send({
                status: 'succes',
                data: data.map(item => ({
                    customer_id: item.customer.id,
                    customer_phone: item.customer.phone,
                    customer_name: item.customer.name,
                    "Pet id": item.petId,
                    type: item.petType,
                    gender: item.petGender,
                    size: item.petSize,
                    age: item.petAge,
                    good_with_children: item.petGoodWithChildren
                }))
            });
        } catch (error: any) {
             return reply
               .status(500)
               .send({ status: "error", message: error.message });
        }
    }

    async generateReport(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { from_date, to_date } = request.body as any;

            if (!from_date || !to_date) {
                return reply.status(400).send({status:'error', message:'from_date and to_date are required'})
            }

            const report = await this.generateReportUseCase.execute(from_date, to_date);

            return reply.status(200).send({
        status: 'success',
        data: report
      });
        } catch (error: any) {
            return reply
              .status(500)
              .send({ status: "error", message: error.message });
        }
    }
}