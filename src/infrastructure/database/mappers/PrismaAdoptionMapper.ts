import { Adoption as PrismaAdoption, Customer as PrismaCustomer } from "@prisma/client";
import { Adoption } from "../../../domain/entities/Adoption";
import { PetSource, PetGender, PetSize, PetAge, PetType } from '../../../domain/entities/Pet';
import { AdoptionWithCustomer } from "../../../domain/repositories/IAdoptionRepostory";

export class PrismaAdoptionMapper {
  static toDomain(prismaAdoption: PrismaAdoption): Adoption {
    return {
      id: prismaAdoption.id,
      customerId: prismaAdoption.customerId,
      petId: prismaAdoption.petId,
      source: prismaAdoption.source as PetSource,
      petType: prismaAdoption.petType as PetType,
      petGender: prismaAdoption.petGender as PetGender,
      petSize: prismaAdoption.petSize as PetSize,
      petAge: prismaAdoption.petAge as PetAge,
      petGoodWithChildren: prismaAdoption.petGoodWithChildren,
      localPetId: prismaAdoption.localPetId,
      createdAt: prismaAdoption.created_at,
    };
  }
  static toDomainWithCustomer(
    prismaAdoption: PrismaAdoption & {
      customer: Pick<PrismaCustomer, "id" | "name" | "phone" | "created_at">;
    },
  ): AdoptionWithCustomer {
    const domainAdoption = PrismaAdoptionMapper.toDomain(prismaAdoption);
    return {
      ...domainAdoption,
      customer: {
        id: prismaAdoption.customer.id,
        name: prismaAdoption.customer.name,
        phone: prismaAdoption.customer.phone,
        createdAt: prismaAdoption.customer.created_at,
      },
    };
  }
}