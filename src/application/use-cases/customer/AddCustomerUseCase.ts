import { ICustomerRepository } from "../../../domain/repositories/ICustomerRepository";
import { Customer } from "../../../domain/entities/Customer";

interface AddCustomerRequest {
    name: string;
    phone: string;
}

export class AddCustomerUseCase {
    constructor( private customerRepository: ICustomerRepository)
    { }
    
    async execute(request: AddCustomerRequest): Promise<Customer>{
        // Check if customer exists
        const existingCustomer = await this.customerRepository.findByPhone(request.phone);

        if (existingCustomer) {
            return existingCustomer;
        }

        // if not create new 
        return await this.customerRepository.save(request)
    }
}