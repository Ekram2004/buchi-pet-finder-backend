import { Pet, PetAge, PetGender, PetSize , PetType} from "../entities/Pet";

export interface PetFilter {
  type?: PetType[];
  gender?: PetGender[];
  size?: PetSize[];
  age?: PetAge[];
    goodWithChildren?: boolean;
    limit: number;
}


export interface IPetRepository {
    save(pet: Omit<Pet, 'id' | 'source' | 'createdAt'>): Promise<Pet>;
    findAll(filter: PetFilter): Promise<Pet[]>;
    findById(id: string): Promise<Pet | null>;
}

