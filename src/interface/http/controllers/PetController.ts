import { FastifyReply, FastifyRequest } from "fastify";
import { CreatePetUseCase } from "../../../application/use-cases/pet/CreatePetUseCase";
import { GetPetsUseCase } from "../../../application/use-cases/pet/GetPetsUseCase";
import {
  Pet,
  PetGender,
  PetType,
  PetSource,
  PetAge,
  PetSize,
} from "../../../domain/entities/Pet";
import { PetFilter } from "../../../domain/repositories/IPetRepository";

interface CreatePetRequestBody {
  type: PetType;
  gender: PetGender;
  size: PetSize;
  age: PetAge;
  good_with_children: boolean;
  photos: string[];
}

interface GetPetsRequestQuery {
  type?: PetType | PetType[];
  gender?: PetGender | PetGender[];
  size?: PetSize | PetSize[];
  age?: PetAge | PetAge[];
  good_with_children?: string;
  limit?: string;
}

export class PetController {
  constructor(
    private createPetUseCase: CreatePetUseCase,
    private getPetsUseCase: GetPetsUseCase,
  ) {}

  async createPet(
    request: FastifyRequest<{ Body: CreatePetRequestBody }>,
    reply: FastifyReply,
  ) {
    try {
      const petInput: Omit<Pet, "id" | "source" | "createdAt"> = {
        type: request.body.type,
        gender: request.body.gender,
        size: request.body.size,
        age: request.body.age,
        goodWithChildren: request.body.good_with_children,
        photos: request.body.photos,
      };
      const newPet = await this.createPetUseCase.execute(petInput);

      return reply.status(201).send({
        status: "success",
        pet_id: newPet.id,
      });
    } catch (error: any) {
      request.log.error(error, "Error creating pet");
      return reply.status(500).send({
        status: "error",
        message: "Failed to create pet.",
        error: error.message,
      });
    }
  }

  async getPets(
    request: FastifyRequest<{ Querystring: GetPetsRequestQuery }>,
    reply: FastifyReply,
  ) {
    try {
      const query = request.query;

      const toArray = (val: any) =>
        Array.isArray(val) ? val : val ? [val] : undefined;

      const filter: PetFilter = {
        type: toArray(query.type) as PetType[] | undefined,
        gender: toArray(query.gender) as PetGender[] | undefined,
        size: toArray(query.size) as PetSize[] | undefined,
        age: toArray(query.age) as PetAge[] | undefined,
        goodWithChildren:
          query.good_with_children === "true"
            ? true
            : query.good_with_children === "false"
              ? false
              : undefined,
        limit: parseInt(query.limit || "10"),
      };

      if (isNaN(filter.limit) || filter.limit <= 0) {
        return reply.status(400).send({
          status: "error",
          message: "Limit must be a positive number.",
        });
      }

      const pets = await this.getPetsUseCase.execute(filter);

      const responsePets = pets.map((pet) => ({
        pet_id: pet.id,
        type: pet.type,
        gender: pet.gender,
        size: pet.size,
        age: pet.age,
        good_with_children: pet.goodWithChildren,
        photos: pet.photos,
        source: pet.source,
      }));

      return reply.status(200).send({ status: "success", pets: responsePets });
    } catch (error: any) {
      request.log.error(error, "Error getting pets");
      return reply.status(500).send({
        status: "error",
        message: "Failed to retrieve pets.",
        error: error.message,
      });
    }
  }
}
