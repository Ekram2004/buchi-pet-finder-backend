import { FastifyReply, FastifyRequest } from "fastify";
import { AddCustomerUseCase } from "../../../application/use-cases/cutomer/AddCustomerUseCase";


export class CustomerController {
    constructor(private addcustomerUseCase: AddCustomerUseCase) { }
    
    async addCustomer(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { name, phone } = request.body as any;

            if (!name || !phone) {
                return reply.status(400).send({ status: 'error', message: 'Name and phone are required' });
            }

            const customer = await this.addcustomerUseCase.execute({ name, phone });

            return reply.status(201).send({
                status: 'success',
                customer_id: customer.id
            });
        } catch (error: any) {
            return reply.status(500).send({ status: 'error', message: error.message });
        }
    }
}