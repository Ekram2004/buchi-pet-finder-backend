import { Adoption } from "../entities/Adoption";

export interface IAdoptionRepository {
  save(adoption: Omit<Adoption, "id" | "createdAt">): Promise<Adoption>;
  findRequestsByDateRange(
    fromDate: Date,
    toDate: Date,
  ): Promise<AdoptionWithCustomer[]>;

  getReportData(fromDate: Date, toDate: Date): Promise<Adoption[]>;
}

export interface AdoptionWithCustomer extends Adoption{
    customer: {
        id: string;
        name: string;
        phone: string;
        createdAt: Date;
    };
}