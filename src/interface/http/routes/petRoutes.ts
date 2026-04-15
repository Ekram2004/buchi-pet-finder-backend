// src/interface/http/routes/petRoutes.ts
import { FastifyInstance } from 'fastify';
import { FastifyPluginOptions } from 'fastify';
import { PetController } from '../controllers/PetController';
import { CreatePetUseCase } from '../../../application/use-cases/pet/CreatePetUseCase';
import { GetPetsUseCase } from '../../../application/use-cases/pet/GetPetsUseCase';
import { PrismaPetRepository } from '../../../infrastructure/database/repositories/PrismaPetRepository';
import { PetFinderService } from "../../../infrastructure/external-api/PetFinderService";
import { PetGender, PetSize, PetAge, PetType, PetSource } from '../../../domain/entities/Pet';


interface PetRoutesOptions extends FastifyPluginOptions {
  createPetUseCase: CreatePetUseCase;
  getPetsUseCase: GetPetsUseCase;
}

export async function petRoutes(fastify: FastifyInstance, options: PetRoutesOptions) {
  const { createPetUseCase, getPetsUseCase } = options;
  const controller = new PetController(createPetUseCase, getPetsUseCase);

  
  const createPetSchema = {
    body: {
      type: "object",
      required: [
        "type",
        "gender",
        "size",
        "age",
        "good_with_children",
        "Photo",
      ],
      properties: {
        type: { type: "string", enum: Object.values(PetType) },
        gender: { type: "string", enum: Object.values(PetGender) },
        size: { type: "string", enum: Object.values(PetSize) },
        age: { type: "string", enum: Object.values(PetAge) },
        good_with_children: { type: "boolean" },
        Photo: { type: "array", items: { type: "string" } },
      },
      additionalProperties: false,
    },
    response: {
      201: {
        type: "object",
        properties: {
          status: { type: "string" },
          message: { type: "string" },
          pet_id: { type: "string" },
        },
      },
      400: {
        type: "object",
        properties: { status: { type: "string" }, message: { type: "string" } },
      },
      500: {
        type: "object",
        properties: {
          status: { type: "string" },
          message: { type: "string" },
          error: { type: "string" },
        },
      },
    },
  };

  
  const getPetsSchema = {
    querystring: {
      type: "object",
      properties: {
        type: {
          type: "array",
          items: { type: "string", enum: Object.values(PetType) },
        },
        gender: {
          type: "array",
          items: { type: "string", enum: Object.values(PetGender) },
        },
        size: {
          type: "array",
          items: { type: "string", enum: Object.values(PetSize) },
        },
        age: {
          type: "array",
          items: { type: "string", enum: Object.values(PetAge) },
        },
        good_with_children: { type: "boolean" },
        limit: { type: "number", minimum: 1 },
      },
      required: ["limit"],
      additionalProperties: false,
    },
    response: {
      200: {
        type: "object",
        properties: {
          status: { type: "string" },
          pets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                pet_id: { type: "string" },
                type: { type: "string", enum: Object.values(PetType) },
                gender: { type: "string", enum: Object.values(PetGender) },
                size: { type: "string", enum: Object.values(PetSize) },
                age: { type: "string", enum: Object.values(PetAge) },
                good_with_children: { type: "boolean" },
                photos: { type: "array", items: { type: "string" } },
                source: { type: "string", enum: Object.values(PetSource) },
              },
            },
          },
        },
      },
      400: {
        type: "object",
        properties: { status: { type: "string" }, message: { type: "string" } },
      },
      500: {
        type: "object",
        properties: {
          status: { type: "string" },
          message: { type: "string" },
          error: { type: "string" },
        },
      },
    },
  };


  fastify.post(
    "/create_pet",
    { schema: createPetSchema },
    controller.createPet.bind(controller),
  );
  
  fastify.get(
    "/get_pets",
    { schema: getPetsSchema },
    controller.getPets.bind(controller),
  );
}
