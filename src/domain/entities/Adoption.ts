import { PetSource, PetGender, PetSize, PetAge, PetType } from "./Pet";


export interface Adoption {
  id: string;
  customerId: string;
  petId: string;
  source: PetSource;
  petType: PetType;
  petGender: PetGender;
  petSize: PetSize;
  petAge: PetAge;
  petGoodWithChildren: boolean;
  localPetId?: string | null;
  createdAt: Date;
}