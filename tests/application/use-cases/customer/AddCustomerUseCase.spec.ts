import { AddCustomerUseCase } from "../../../../src/application/use-cases/customer/AddCustomerUseCase";
import { ICustomerRepository } from "../../../../src/domain/repositories/ICustomerRepository";
import { mock } from 'jest-mock-extended';

describe("AddCustomerUseCase", () => {
    const mockCustomerRepo = mock<ICustomerRepository>();
    const useCase = new AddCustomerUseCase(mockCustomerRepo);

    it('should return existing customer if phone number already exists', async () => {
        const existingCustomer = { id: "123", name: "Abebe", phone: "0911" };
        mockCustomerRepo.findByPhone.mockResolvedValue(existingCustomer);

        const result = await useCase.execute({
          name: "New Name",
          phone: "0911",
        });

        expect(result.id).toBe('123');
        expect(mockCustomerRepo.save).not.toHaveBeenCalled();
    })
});