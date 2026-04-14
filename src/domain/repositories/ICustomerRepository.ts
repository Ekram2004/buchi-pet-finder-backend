import { Customer } from "../entities/Customer";

export interface ICustomerRepository {
    findByPhone(phone: string): Promise<Customer | null>;
    findById(id: string): Promise<Customer | null>;
    save(customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer>;
}