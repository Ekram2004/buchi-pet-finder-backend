import { IPetRepository } from "../../../domain/repositories/IPetRepository";
import { Pet } from "../../../domain/entities/Pet";

export class CreatePetUseCase {
  constructor(private petRepo: IPetRepository) { }
  
  async execute(data: Omit<Pet, 'id' | 'source' | 'createdAt'>): Promise<Pet>{
    return await this.petRepo.save(data);
  }
}