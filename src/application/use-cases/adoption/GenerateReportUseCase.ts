
import { IAdoptionRepository } from "../../../domain/repositories/IAdoptionRepostory";

export class GenerateReportUseCase {
  constructor(private adoptionRepository: IAdoptionRepository) {}

  async execute(fromDate: Date, toDate: Date) {
    const adoptions = await this.adoptionRepository.getReportData(
      fromDate,
      toDate,
    );

    // 1. Group by Pet Type
    const typeCounts = adoptions.reduce(
      (acc, curr) => {
        const type = curr.petType;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // 2. Group by Week
    const weeklyRequests = adoptions.reduce(
      (acc, curr) => {
        const week = this.getWeekNumber(curr.createdAt);
        const year = curr.createdAt.getFullYear();
        const key = `${year}-W${week}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalAdoptions: adoptions.length,
      adoptedPetTypes: typeCounts,
      weeklyAdoptionRequests: weeklyRequests,
    };
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}
