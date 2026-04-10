export enum PetGender { MALE = 'male', FEMALE = 'female' }
export enum PetSize { SMALL = 'small', MEDIUM = 'medium', LARGE = 'large', XLARGE = 'xlarge' }
export enum PetAge { BABY = 'baby', YOUNG = 'young', ADULT = 'adult', SENIOR = 'senior' }
export enum PetSource { LOCAL = 'local', PETFINDER = 'petfinder' }
export enum PetType {DOG = 'dog', CAT='cat', BIRD='bird'}

export interface Pet {
  id: string;
  type: PetType;
  gender: PetGender;
  size: PetSize;
  age: PetAge;
 goodWithChildren: boolean;
 photos: string[];
source: PetSource;
createdAt?: Date;
}

