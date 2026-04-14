import { IAdoptionRepository } from "../../../domain/repositories/IAdoptionRepostory";
import { IPetRepository } from "../../../domain/repositories/IPetRepository";
import { ICustomerRepository } from "../../../domain/repositories/ICustomerRepository";
import { PetFinderService } from "../../../infrastructure/external-api/PetFinderService";
import { PetSource } from "../../../domain/entities/Pet";

export class AdoptPetUseCase {
    constructor(
        private adoptionRepo: IAdoptionRepository,
        private petRepo: IPetRepository,
        private customerRepo: ICustomerRepository,
        private petFinder: PetFinderService
    )
    { }
    
    async execute(customerId: string, petId: string) {
        // 1 verify customer exists
        const customer = await this.customerRepo.findById(customerId);
        if (!customer) throw new Error('Customer not found');

        // 2 Finde Pet(Try Local first)
        let pet = await this.petRepo.findById(petId);
        let source = PetSource.LOCAL;
        let localPetId: string | null = petId;

        // 3 If not local , try PetFinder (Mock)
        if (!pet) {
            const externalPets = await this.petFinder.getAnimals({ limit: 10 });
            pet = externalPets.find(p => p.id === petId) || null;
            source = PetSource.PETFINDER;
            localPetId = null;
        }

        if (!pet) throw new Error('Pet not found in local database or PetFinder');

        // 4 Create Adoption Record with denormalized data
        return await this.adoptionRepo.save({
            customerId,
            petId: pet.id,
            petType: pet.type,
            petGender: pet.gender,
            petSize: pet.size,
            petAge: pet.age,
            petGoodWithChildren: pet.goodWithChildren,
            source: source,
            localPetId: localPetId
        });
    }
}