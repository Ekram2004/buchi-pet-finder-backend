import { IPetRepository, PetFilter } from "../../../domain/repositories/IPetRepository";
import { IPetFinderService } from "../../../domain/repositories/IPetFinderService";
import { Pet } from "../../../domain/entities/Pet";

export class GetPetsUseCase {
    constructor(
        private localPetRepository: IPetRepository,
        private petFinderService: IPetFinderService
    )
    { }
    
    async execute(filter: PetFilter): Promise<Pet[]>{
        // 1 Fetch from local DB
        const localPets = await this.localPetRepository.findAll(filter);

        //2 if we already hit the limit with local pets, return them immediately
        if (localPets.length >= filter.limit) {
            return localPets.slice(0, filter.limit);
        }

        // 3 otherwise fetch from Petfinder to fill the remaining slots 
        const remainigLimit = filter.limit - localPets.length;
        try {
            const petFinderPets = await this.petFinderService.getAnimals({
                ...filter,
                limit: remainigLimit
            });

            // 4 Combine results: Local results ALWAYS come first
            return [...localPets, ...petFinderPets];
        } catch (error) {
            // if the petfinder API is down return the local results instead of crashing the whole request
            return localPets;
        }
    }
}