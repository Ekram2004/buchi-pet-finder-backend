import axios from "axios";
import { IPetFinderService } from "../../domain/repositories/IPetFinderService";
import {
  Pet,
  PetSource,
  PetGender,
  PetAge,
  PetSize,
  PetType,
} from "../../domain/entities/Pet";
import { PetFilter } from "../../domain/repositories/IPetRepository";

export class PetFinderService implements IPetFinderService {
  // Dog API for Dogs, Cat API for Cats
  private dogApiUrl = "https://thedogapi.com";
  private catApiUrl = "https://thecatapi.com";

  async getAnimals(filter: PetFilter): Promise<Pet[]> {
  try {
    // 1. Correct endpoints for image search
    const isCat = filter.type?.includes(PetType.CAT);
    const apiUrl = isCat 
      ? "https://api.thecatapi.com/v1/images/search" 
      : "https://api.thedogapi.com/v1/images/search";
    
    const apiKey = isCat ? process.env.CAT_API_KEY : process.env.DOG_API_KEY;

    const response = await axios.get(apiUrl, {
      params: {
        limit: filter.limit || 10,
        has_breeds: 1,
        // The API uses 'breed_ids' or 'mime_types' if you want to get specific
      },
      headers: { "x-api-key": apiKey || "" },
    });

    return response.data.map((item: any) => {
      const breed = item.breeds?.[0];
      return {
        id: `ext-${item.id}`,
        type: isCat ? PetType.CAT : PetType.DOG,
        gender: filter.gender?.[0] || PetGender.MALE, // Match your DB lowercase if needed
        size: this.mapWeightToSize(breed?.weight?.metric),
        age: filter.age?.[0] || PetAge.YOUNG,
        goodWithChildren: filter.goodWithChildren ?? true,
        // Map to your PetPhoto structure if necessary,
        // or just return the URL if the UseCase handles the wrapping
        photos: [{ url: item.url }],
        source: PetSource.PETFINDER,
      };
    });
  } catch (error) {
    console.error("External API Fetch Failed:", error);
    return [];
  }

  }

  private mapWeightToSize(weightMetric?: string): PetSize {
    if (!weightMetric) return PetSize.MEDIUM;
    const weight = parseInt(weightMetric.split(" - ")[0]);
    if (weight < 10) return PetSize.SMALL;
    if (weight < 25) return PetSize.MEDIUM;
    if (weight < 45) return PetSize.LARGE;
    return PetSize.XLARGE;
  }
}
