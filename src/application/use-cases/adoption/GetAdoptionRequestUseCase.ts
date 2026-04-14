import { IAdoptionRepository } from "../../../domain/repositories/IAdoptionRepostory";

export class GetAdoptionRequestUseCase {
    constructor(private adoptionRepo: IAdoptionRepository) { }
    
    async execute(formDate: string, toDate: string) {
        const start = new Date(formDate);
        const end = new Date(toDate);

        end.setHours(23, 59, 59, 999);

        return await this.adoptionRepo.findRequestsByDateRange(start, end);
    }
}