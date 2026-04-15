export enum PetGender { MALE = 'male', FEMALE = 'female' }
export enum PetSize { SMALL = 'small', MEDIUM = 'medium', LARGE = 'large', XLARGE = 'xlarge' }
export enum PetAge { BABY = 'baby', YOUNG = 'young', ADULT = 'adult', SENIOR = 'senior' }
export enum PetSource { LOCAL = 'local', PETFINDER = 'petfinder' }
export enum PetType {DOG = 'Dog', CAT='Cat', BIRD='bird'}

export interface Pet {
  id: string;
  type: PetType;
  gender: PetGender;
  size: PetSize;
  age: PetAge;
  goodWithChildren: boolean;
  Photo: string[];
  source: PetSource;
  createdAt?: Date;
}

