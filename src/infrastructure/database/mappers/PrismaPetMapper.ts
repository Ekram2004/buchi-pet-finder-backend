import { Pet as PrismaPet, PetPhoto as PrismaPhoto } from '@prisma/client';
import { Pet, PetGender, PetSize, PetAge, PetSource, PetType } from '../../../domain/entities/Pet';

export class PrismaPetMapper {
    static toDomain(prismaPet: PrismaPet & { photos?: PrismaPhoto[] }): Pet{
        return {
            id: prismaPet.id,
            type: prismaPet.type as PetType,
            gender: prismaPet.gender as PetGender,
            size: prismaPet.size as PetSize,
            age: prismaPet.age as PetAge,
            goodWithChildren: prismaPet.good_with_children,
            photos: prismaPet.photos?.map(p => p.url) || [],
            source: PetSource.LOCAL,
            createdAt: prismaPet.created_at
        };
    }
}