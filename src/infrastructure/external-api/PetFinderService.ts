import axios from 'axios';
import { IPetFinderService } from '../../domain/repositories/IPetFinderService';
import { Pet, PetSource, PetGender, PetAge, PetSize, PetType } from '../../domain/entities/Pet';
import { PetFilter } from '../../domain/repositories/IPetRepository';

export class PetFinderService implements IPetFinderService {
    private baseUrl = "https://api.petfinder.com/v2";
    private accessToken: string | null = null;
    private expiresAt: number = 0;

    private async getValidToken(): Promise<string>{
        // Check if token exists and is still valid (with a 5-minute buffer)
        const now = Date.now();
        if (this.accessToken && now < this.expiresAt - 300000) {
            return this.accessToken;
        }

        try {
            const response = await axios.post(`${this.baseUrl}/oauth2/token`, {
                grant_type: 'client_credentials',
                client_id: process.env.PETFINDER_KEY,
                client_secret: process.env.PETFINDER_SECRET
            });

            this.accessToken = response.data.access_token;
            this.expiresAt = now + (response.data.expires_in * 1000);

            return this.accessToken!;
        } catch (error) {
            throw new Error("Failed to authenticate with Petfinder API");
        }
    }

    async getAnimals(filter: PetFilter): Promise<Pet[]> {
        try {
            if (!this.accessToken) await this.getValidToken();

            const params = {
                type: filter.type?.join(','),
                gender: filter.gender?.join(','),
                size: filter.size?.join(','),
                age: filter.age?.join(','),
                good_with_children: filter.goodWithChildren,
                limit: filter.limit
            };

            const response = await axios.get(`${this.baseUrl}/animals`, {
                params,
                headers: { Authorization: `Bearer ${this.accessToken}` }
            });

            //Map PetFinder API response to our Domain Pet Entity
            return response.data.animals.map((animal: any) => ({
                id: animal.id.toString(),
                type: animal.type.toLowerCase() as PetType,
                gender: animal.gender.toLowerCase() as PetGender,
                size: animal.size.toLowerCase() as PetSize,
                age: animal.age.toLowerCase() as PetAge,
                goodWithChildren: animal.attributes.good_with_children,
                photos: animal.photos.map((p: any) => p.full),
                source: PetSource.PETFINDER
            }));
        } catch (error) {
            console.error('Error fetching from Petfinder', error);
            return []; // Return empty array so the app continues with local results
        }
    }
}