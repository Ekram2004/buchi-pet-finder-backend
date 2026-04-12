// import { IPetRepository } from "../../../domain/repositories/IPetRepository";
// import { Pet, PetAge, PetGender, PetSize, PetSource, PetType } from '../../../domain/entities/Pet';

// interface CreatePetRequest {
//   type: PetType;
//   gender: PetGender;
//   size: PetSize;
//   age: PetAge;
//  goodWithChildren: boolean;
//  photos: string[];
// }


// export class CreatePetUseCase {
//     constructor(private petRepository: IPetRepository) { }
    
//     async execute(request: CreatePetRequest): Promise<Pet>{
//         // ensure mark this as a local pet
//         return await this.petRepository.save({
//           ...request,
//           source: PetSource.LOCAL,
//         });
//     }
// }

import { PrismaPetRepository } from "../../../infrastructure/database/repositories/PrismaPetRepository";

export class CreatePetUseCase {
  constructor(private petRepo: PrismaPetRepository) { }
  async execute(data: any) {
    return await this.petRepo.save(data);
  }
  
}