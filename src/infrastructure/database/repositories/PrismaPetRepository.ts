import { IPetRepository, PetFilter } from "../../../domain/repositories/IPetRepository";
import { Pet } from "../../../domain/entities/Pet";
import { prisma} from '../../../lib/prisma';
import { PrismaPetMapper } from "../mappers/PrismaPetMapper";

export class PrismaPetRepository implements IPetRepository{
    async save(pet: Omit<Pet, 'id' | 'source' | 'createdAt'>): Promise<Pet>{
        // const photoUrls = pet.Photo || [];
        const created = await prisma.pet.create({
          data: {
            type: pet.type as any,
            gender: pet.gender as any,
            size: pet.size as any,
            age: pet.age as any,
            good_with_children: pet.goodWithChildren,
            photos: {
                create: pet.Photo.map((url:string)=>({url}))
            }
            },
            include:{photos: true}
        });
        return PrismaPetMapper.toDomain(created);
    }
    async findAll(filter: PetFilter): Promise<Pet[]> {
        const pets = await prisma.pet.findMany({
            where: {
                type: filter.type ? { in: filter.type as any } : undefined,
                gender: filter.gender ? { in: filter.gender as any } : undefined,
                size: filter.size ? { in: filter.size as any } : undefined,
                age: filter.age ? { in: filter.age as any } : undefined,
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