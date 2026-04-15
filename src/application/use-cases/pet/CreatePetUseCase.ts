import { IPetRepository } from "../../../domain/repositories/IPetRepository";
import { Pet } from "../../../domain/entities/Pet";
import { FileStorageService } from "../../../infrastructure/services/FileService";
import { PetSource } from "@prisma/client";

// src/application/use-cases/pet/CreatePetUseCase.ts
export class CreatePetUseCase {
  constructor(
    private petRepo: IPetRepository,
    private fileService: FileStorageService
  ) {}

  async execute(data: any): Promise<any> {
    const photoUrls = data.Photo || [];
    
    if (photoUrls.length === 0) {
      console.warn("No photo URLs provided in request");
    }

    // 1. Wait for all downloads to finish
    const filenames = await Promise.all(
      photoUrls.map((url: string) => this.fileService.save(url))
    );

    // 2. Format paths for the DB
    const accessiblePaths = filenames.map(name => `/uploads/${name}`);

    // 3. Save to Repository (Ensure you pass accessiblePaths)
    return await this.petRepo.save({
      ...data,
      Photo: accessiblePaths, 
    });
  }
}