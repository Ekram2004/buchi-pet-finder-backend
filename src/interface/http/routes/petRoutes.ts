// import { FastifyInstance, FastifyPluginOptions } from "fastify";
// import { PetController } from "../controllers/PetController";
// import { CreatePetUseCase } from "../../../application/use-cases/pet/CreatePetUseCase";
// import { GetPetsUseCase } from "../../../application/use-cases/pet/GetPetsUseCase";
// import { PetAge, PetGender, PetSize, PetType } from '../../../domain/entities/Pet'

// interface PetRoutesOptions extends FastifyPluginOptions{
//     createPetUseCase: CreatePetUseCase;
//     getPetsUseCase: GetPetsUseCase;
// }

// export async function petRoutes(fastify: FastifyInstance, options: PetRoutesOptions) {
//     const { createPetUseCase, getPetsUseCase } = options;
//     const petController = new PetController(createPetUseCase, getPetsUseCase);

//     const createdPetSchema = {
//       body: {
//         type: "object",
//         required: [
//           "type",
//           "gender",
//           "size",
//           "age",
//           "good_with_children",
//           "photos",
//         ],
//         properties: {
//           type: { type: "string", enum: Object.values(PetType) },
//           gender: { type: "string", enum: Object.values(PetGender) },
//           size: { type: "string", enum: Object.values(PetSize) },
//           age: { type: "string", enum: Object.values(PetAge) },
//           good_with_children: { type: "boolean" },
//           photos: { type: "array", items: { type: "string" } },
//         },
//         additionalProperties: false, // Disallow external properties
//         },
//         response: {
//             201: {
//                 type: 'object',
//                 properties: {
//                     status: { type: 'string' },
//                     message: { type: 'string' },
//                     pet_id:{type:'string'}
//                 }
//             },
//             400: {
//                 type: 'object',
//                 properties: {
//                     status: { type: 'string' },
//                     message:{type:'string'},
//                 }
//             },
//             500: {
//                 type: 'object',
//                 properties: {
//                     status: { type: 'string' },
//                     message: { type: 'string' },
//                     error:{type:'string'}
//                 }
//             }
//         }
//     };

//     const getPetsSchema = {
//       queryString: {
//         type: "object",
//         required: ["limit"],
//         properties: {
//           type: {
//             type: "array",
//             items: { type: "string", enum: Object.values(PetType) },
//           },
//           gender: {
//             type: "array",
//             items: { type: "string", enum: Object.values(PetGender) },
//           },
//           size: {
//             type: "array",
//             items: { type: "string", enum: Object.values(PetSize) },
//           },
//           age: {
//             type: "array",
//             items: { type: "string", enum: Object.values(PetAge) },
//           },
//           good_with_children: { type: "boolean" },
//           limit: { type: "number", minimum: 1 },
//         },
//         additionalProperties: false,
//       },
//       response: {
//         200: {
//           type: "object",
//           properties: {
//             status: { type: "string" },
//             pets: {
//               type: "array",
//               items: {
//                 type: "object",
//                 properties: {
//                   pet_id: { type: "string" },
//                   source: { type: "string" },
//                   type: { type: "string", enum: Object.values(PetType) },
//                   gender: { type: "string", enum: Object.values(PetGender) },
//                   size: { tyoe: "string", enum: Object.values(PetSize) },
//                   age: { type: "string", enum: Object.values(PetAge) },
//                   good_with_children: { type: "boolean" },
//                   photos: { type: "array", items: { type: "string" } },
//                 },
//               },
//             },
//           },
//         },
//         400: {
//           type: "object",
//           properties: {
//             status: { type: "string" },
//             message: { type: "string" },
//           },
//         },
//         500: {
//           type: "object",
//             properties: {
//                 status: { type: 'string' },
//                 message: { type: 'string' },
//                 error:{type:'string'}
//           }
//         },
//       },
//     };
//     fastify.post('/', { schema: createdPetSchema },
//         petController.createPet.bind(petController));
//     fastify.get('/', { schema: getPetsSchema },
//         petController.getPets.bind(petController)
//     )
    
// }

import { FastifyInstance } from 'fastify';
import { CreatePetUseCase } from '../../../application/use-cases/pet/CreatePetUseCase';
import { PrismaPetRepository } from '../../../infrastructure/database/repositories/PrismaPetRepository';
import { request } from 'node:http';

export async function petRoutes(fastify: FastifyInstance) {
  const repo = new PrismaPetRepository();
  const useCase = new CreatePetUseCase(repo);

  fastify.post('/', async (request, reply) => {
    const body = request.body as any;

    const result = await useCase.execute({
      ...body,
      goodWithChildren: body.good_with_children
    });

    return { status: 'success', pet_id: result.id };
  });
}

