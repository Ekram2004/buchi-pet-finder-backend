import { ICustomerRepository } from "../../../domain/repositories/ICustomerRepository";
import { Customer } from "../../../domain/entities/Customer";
import { prisma } from '../../../lib/prisma';

export class PrismaCustomerRepository implements ICustomerRepository{
    async findByPhone(phone: string): Promise<Customer | null> {
        const customer = await prisma.customer.findUnique({ where: { phone } });
        return customer ? { ...customer, createdAt: customer.created_at } : null;
    }

    async findById(id: string): Promise<Customer | null> {
        const customer = await prisma.customer.findUnique({ where: { id } });
        return customer ? { ...customer, createdAt: customer.created_at } : null;
    }

    async save(data: Omit<Customer, "id">): Promise<Customer> {
        const customer = await prisma.customer.create({
            data: {
                name: data.name,
                phone: data.phone
            }
        });
        return { ...customer, createdAt: customer.created_at };
    }
}