import { IPetRepository, PetFilter } from "../../../domain/repositories/IPetRepository";
import { Pet } from "../../../domain/entities/Pet";
import { prisma } from '../../../lib/prisma';
import { PrismaPetMapper } from "../mappers/PrismaPetMapper";

export class PrismaPetRepository implements IPetRepository{
    async save(pet: any): Promise<Pet>{
        const created = await prisma.pet.create({
          data: {
            type: pet.type,
            gender: pet.gender,
            size: pet.size,
            age: pet.age,
            good_with_children: pet.goodWithChildren,
            photos: {
                create: pet.photos.map((url:string)=>({url}))
            }
            },
            include:{photos: true}
        });
        return PrismaPetMapper.toDomain(created);
    }
    async findAll(filter: PetFilter): Promise<Pet[]> {
        const pets = await prisma.pet.findMany({
            where: {
                type: filter.type ? { in: filter.type } : undefined,
                gender: filter.gender ? { in: filter.gender } : undefined,
                size: filter.size ? { in: filter.size } : undefined,
                age: filter.age ? { in: filter.age } : undefined,
                good_with_children: filter.goodWithChildren
            },
            take: filter.limit,
            include: { photos: true },
            orderBy: { created_at: 'desc' }
        });

        return pets.map(PrismaPetMapper.toDomain);
    }

    async findById(id: string): Promise<Pet | null> {
        const pet = await prisma.pet.findUnique({
            where: { id },
            include: { photos: true }
        });
        return pet ? PrismaPetMapper.toDomain(pet) : null;
    }
}