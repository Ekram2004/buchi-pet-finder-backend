import { GetPetsUseCase } from "../../../../src/application/use-cases/pet/GetPetsUseCase";
import { IPetRepository } from "../../../../src/domain/repositories/IPetRepository";
import { PetFinderService } from "../../../../src/infrastructure/external-api/PetFinderService";
import { mock } from 'jest-mock-extended';
import { PetSource, PetType, PetGender, PetSize, PetAge } from "../../../../src/domain/entities/Pet";

describe('GetPetsUseCase', () => {
    // 1. Create Mocks for the dependencies
    const mockpetRepo = mock<IPetRepository>();
    const mockPetFinder = mock<PetFinderService>();

    // 2. Initialize the Use Case with mocks 
    const useCase = new GetPetsUseCase(mockpetRepo, mockPetFinder);

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it(
        "should return local pets first and then fill the rest with Petfinder pets", async () => {
            const localPet = {
              id: "local-1",
              type: PetType.DOG,
              gender: PetGender.MALE,
              size: PetSize.SMALL,
              age: PetAge.BABY,
              goodWithChildren: true,
              Photo: [],
              source: PetSource.LOCAL,
            };

            const pfPet = {
              id: "pf-1",
              type: PetType.DOG,
              gender: PetGender.FEMALE,
              size: PetSize.MEDIUM,
              age: PetAge.ADULT,
              goodWithChildren: true,
              Photo: [],
              source: PetSource.PETFINDER,
            };

            mockpetRepo.findAll.mockResolvedValue([localPet]);
            mockPetFinder.getAnimals.mockResolvedValue([pfPet]);

            
            const filter = { limit: 5, type: [PetType.DOG] };
            const result = await useCase.execute(filter);


            expect(result).toHaveLength(2);
            expect(result[0].source).toBe(PetSource.LOCAL);
            expect(result[1].source).toBe(PetSource.PETFINDER);
            expect(mockpetRepo.findAll).toHaveBeenCalledWith(filter);
      }
    );
    it ('should not call Petfinder if local pets already hit the limit', async () => {
        const fivePets = Array(5).fill({});
        mockpetRepo.findAll.mockResolvedValue(fivePets as any);

        await useCase.execute({ limit: 5 });

        expect(mockPetFinder.getAnimals).not.toHaveBeenCalled();
    })
})