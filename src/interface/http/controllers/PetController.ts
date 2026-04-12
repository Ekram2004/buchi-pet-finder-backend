import { FastifyReply, FastifyRequest } from "fastify";
import { CreatePetUseCase } from "../../../application/use-cases/pet/CreatePetUseCase";
import { GetPetsUseCase } from "../../../application/use-cases/pet/GetPetsUseCase";
import { PetAge, PetGender, PetSize, PetType } from "../../../domain/entities/Pet";

interface CreatedPetRequestBody {
    type: PetType;
    gender: PetGender;
    size: PetSize;
    age: PetAge;
    good_with_children: boolean;
    photos: string[];
}

interface GetPetRequestQuery {
  type?: PetType[];
  gender?: PetGender[];
  size?: PetSize[];
  age?: PetAge[];
    good_with_children?: boolean;
    limit: number;
}


export class PetController {
    constructor(
        private createPetUseCase: CreatePetUseCase,
        private getPetsUseCase: GetPetsUseCase
    ) { }
    
    async createPet(request: FastifyRequest<{ Body: CreatedPetRequestBody }>, reply: FastifyReply) {
        try {
            const { good_with_children, ...rest } = request.body;
            const newPet = await this.createPetUseCase.execute({
                ...rest,
                goodWithChildren: good_with_children
            });

            reply.status(201).send({
                status: 'success',
                message: 'Pet created successfully.',
                pet_id: newPet.id,
            });
        } catch (error: any) {
            request.log.error(error, 'Error creating pet');
            reply.status(500).send({ status: 'error', message: 'Failed to created pet.', error: error.message });
        }
    }

    async getPets(request: FastifyRequest<{ Querystring: GetPetRequestQuery }>, reply: FastifyReply) {
        try {
            const { good_with_children, limit, ...rest } = request.query;

            if (isNaN(limit) || limit <= 0) {
                return reply.status(400).send({ status: 'error', message: 'Limit parameter is required and must be a positive ' });
            }

            const pets = await this.getPetsUseCase.execute({
                ...rest,
                goodWithChildren: good_with_children,
                limit: Number(limit)
            });

            reply.status(200).send({
                status: 'success',
                pets: pets.map(pet => ({
                    pet_id: pet.id,
                    source: pet.source,
                    type: pet.type,
                    gender: pet.gender,
                    size: pet.size,
                    age: pet.age,
                    good_with_children: pet.goodWithChildren,
                    photos: pet.photos,
                })),
            });
        } catch (error: any) {
            request.log.error(error, 'Error getting pets');
            reply.status(500).send({ status: 'error', message: 'Failed to retrive pets.', error: error.message });
        }
    }
}