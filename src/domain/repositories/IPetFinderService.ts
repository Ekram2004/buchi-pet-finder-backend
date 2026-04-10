import { Pet } from '../entities/Pet';
import { PetFilter } from './IPetRepository';

export interface IPetFinderService {
    getAnimals(filter: PetFilter): Promise<Pet[]>;
}