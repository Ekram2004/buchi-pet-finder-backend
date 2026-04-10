import { IAdoptionRepository , AdoptionWithCustomer} from "../../../domain/repositories/IAdoptionRepostory";
import { Adoption } from "../../../domain/entities/Adoption";
import { prisma } from '../../../lib/prisma';
import { PetGender, PetAge, PetSize, PetSource , PetType} from "@prisma/client";
import { PrismaAdoptionMapper } from "../mappers/PrismaAdoptionMapper";

export class PrismaAdoptionRepository implements IAdoptionRepository{
    async save(data: Omit<Adoption, "id" | "createdAt">): Promise<Adoption> {
        const adoption = await prisma.adoption.create({
            data: {
                customerId: data.customerId,
                petId: data.petId,
                source: data.source as PetSource,
                petType: data.petType as PetType,
                petGender: data.petGender as PetGender,
                petSize: data.petSize as PetSize,
                petAge: data.petAge as PetAge,
                petGoodWithChildren: data.petGoodWithChildren,
                localPetId: data.localPetId
            }
        });
        return PrismaAdoptionMapper.toDomain({ ...adoption, created_at: adoption.created_at });
    }

    async findRequestsByDateRange(fromDate: Date, toDate: Date): Promise<AdoptionWithCustomer[]> {
      const prismaAdoptions = await prisma.adoption.findMany({
        where: {
          created_at: { gte: fromDate, lte: toDate },
        },
        include: {
          customer: {
            select: { id: true, name: true, phone: true, created_at:true },
          },
        },
        orderBy: { created_at: "asc" },
      });

      return prismaAdoptions.map(PrismaAdoptionMapper.toDomainWithCustomer);
    }
    async getReportData(fromDate: Date, toDate: Date): Promise<Adoption[]> {
        const adoptions = await prisma.adoption.findMany({
            where: {
                created_at: { gte: fromDate, lte: toDate }
            }
        });

        return adoptions.map(PrismaAdoptionMapper.toDomain);
    }
}