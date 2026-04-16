import { AdoptPetUseCase } from "../../../../src/application/use-cases/adoption/AdoptionPetUseCase";
import { IAdoptionRepository } from "../../../../src/domain/repositories/IAdoptionRepostory";
import { IPetRepository } from "../../../../src/domain/repositories/IPetRepository";
import { ICustomerRepository } from "../../../../src/domain/repositories/ICustomerRepository";
import { PetFinderService } from "../../../../src/infrastructure/external-api/PetFinderService";
import { mock } from 'jest-mock-extended';
import { PetType, PetGender, PetSize, PetAge, PetSource } from "../../../../src/domain/entities/Pet";



describe("AdoptPetUseCase", () => {
    const mockAdoptionRepo = mock<IAdoptionRepository>();
    const mockPetRepo = mock<IPetRepository>();
    const mockCustomerRepo = mock<ICustomerRepository>();
    const mockPetFinder = mock<PetFinderService>();

    const useCase = new AdoptPetUseCase(
        mockAdoptionRepo,
        mockPetRepo,
        mockCustomerRepo,
        mockPetFinder
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if the customer does not exist', async () => {
        
        mockCustomerRepo.findById.mockResolvedValue(null);

        await expect(
            useCase.execute("fake-customer", "pet-123"),
        ).rejects.toThrow("Customer not found");
    });

    it("should create an adoption if customer and local pet exist", async () => {
        const mockCustomer = { id: "c1", name: "Abebe", phone: "0911" };
        const mockPet = {
          id: "p1",
          type: PetType.DOG,
          gender: PetGender.MALE,
          size: PetSize.SMALL,
          age: PetAge.BABY,
          goodWithChildren: true,
          Photo: [],
          source: PetSource.LOCAL,
        };

        mockCustomerRepo.findById.mockResolvedValue(mockCustomer);
        mockPetRepo.findById.mockResolvedValue(mockPet);
        mockAdoptionRepo.save.mockResolvedValue({ id: "adopt-1" } as any);

        const result = await useCase.execute('c1', 'p1');

        expect(result.id).toBe("adopt-1");
        expect(mockAdoptionRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            customerId: "c1",
            petId: "p1",
            petType: "Dog",
          }),
        );
    });
});