import { IPetRepository } from "../../../domain/repositories/IPetRepository";
import { Pet, PetAge, PetGender, PetSize, PetSource, PetType } from '../../../domain/entities/Pet';

interface CreatePetRequest {
  type: PetType | string;
  gender: PetGender;
  size: PetSize;
  age: PetAge;
 goodWithChildren: boolean;
 photos: string[];
}


export class CreatePetUseCase {
    constructor(private petRepository: IPetRepository) { }
    
    async execute(request: CreatePetRequest): Promise<Pet>{
        // ensure mark this as a local pet 
        return await this.petRepository.save({
          ...request,
          source: PetSource.LOCAL,
        });
    }
}