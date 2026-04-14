import { IPetRepository, PetFilter } from "../../../domain/repositories/IPetRepository";
import { IPetFinderService } from "../../../domain/repositories/IPetFinderService";
import { Pet } from "../../../domain/entities/Pet";

export class GetPetsUseCase {
    constructor(
        private localRepo: IPetRepository,
        private petFinder: IPetFinderService
    ) { }

    async execute(filter: PetFilter): Promise<Pet[]>{
        // 1 fetch from local db 
        const localPets = await this.localRepo.findAll(filter);

        // 2 if local results already meet the limit, return them 
        if (localPets.length >= filter.limit) {
            return localPets.slice(0, filter.limit);
        }

        // 3 Calculate how many more pets we need from PetFinder
        const remainingLimit = filter.limit - localPets.length;

        // 4 Fetch from PetFinder API
        const externalPets = await this.petFinder.getAnimals({ ...filter, limit: remainingLimit });

        // 5 Combine results : local pets always come first
        return [...localPets, ...externalPets];
    }
    
}