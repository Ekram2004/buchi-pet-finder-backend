import { FastifyInstance } from "fastify";
import { CustomerController } from "../controllers/CustomerController";

export async function customerRoutes(fastify: FastifyInstance, options: any) {
    const { addcustomerUseCase } = options;
    const controller = new CustomerController(addcustomerUseCase);

    fastify.post('/', controller.addCustomer.bind(controller));
}