import { IAdoptionRepository } from "../../../domain/repositories/IAdoptionRepostory";

export class GenerateReportUseCase {
  constructor(private adoptionRepo: IAdoptionRepository) { }
  
  async execute(fromDate: string, toDate: string) {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);

    const adoptions = await this.adoptionRepo.getReportData(start, end);

    //  1 Aggregate by Pet type
    const adopted_pet_types: Record<string, number> = {};
    adoptions.forEach(a => {
      adopted_pet_types[a.petType] = (adopted_pet_types[a.petType] || 0) + 1;
    });

    // 2 Aggregate by Week 
    const weekly_adoption_requests : Record<string, number> = {};

    adoptions.forEach(a => {
      const diffInTime = a.createdAt.getTime() - start.getTime();
      const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
      const weekNumber = Math.floor(diffInDays / 7);

      // Calculate the start date of that specific week 
      const weekStartDate = new Date(start);
      weekStartDate.setDate(start.getDate() + (weekNumber * 7));
      const weekKey = weekStartDate.toISOString().split('T')[0];

      weekly_adoption_requests[weekKey] = (weekly_adoption_requests[weekKey] || 0) + 1;
    });
    return {
      adopted_pet_types,
      weekly_adoption_requests
    }
  }
}