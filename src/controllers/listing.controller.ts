// import { PrismaClient } from "@prisma/client";
// import { Response } from "express";
// import { AuthedRequest } from "../types";
// import {
//   createListingSchema,
//   deleteListingSchema,
//   updateListingSchema,
// } from "../schemas/listing.schema";
// import { ZodError } from "zod";

// const prisma = new PrismaClient();

// export const getListings = async (req: AuthedRequest, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const pageSize = parseInt(req.query.pageSize as string) || 25;
//     const skip = (page - 1) * pageSize;

//     const listings = await prisma.listing.findMany({
//       take: pageSize,
//       skip: skip,
//       select: {
//         id: true,
//         title: true,
//         priceCents: true,
//         currency: true,
//         mainImage: true,
//         shortDescription: true,
//         store: {
//           select: {
//             name: true,
//           },
//         },
//       },
//     });

//     const totalListings = await prisma.listing.count();

//     return res.status(200).json({
//       data: listings,
//       pagination: {
//         page,
//         pageSize,
//         totalPages: Math.ceil(totalListings / pageSize),
//         totalItems: totalListings,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error });
//   }
// };

// export const createListing = async (req: AuthedRequest, res: Response) => {
//   const storeId = req.store?.storeId;

//   if (!storeId) {
//     return res.status(401).json({ message: "No storeId found" });
//   }

//   try {
//     const existingListings = await prisma.listing.count({
//       where: {
//         storeId,
//       },
//     });

//     if (existingListings >= 3) {
//       return res
//         .status(403)
//         .json({ message: "Maximum number of listings reached" });
//     }

//     const validatedData = createListingSchema.parse(req.body);

//     const listing = await prisma.listing.create({
//       data: {
//         ...validatedData,
//         storeId,
//       },
//     });

//     return res.status(201).json({ data: listing });
//   } catch (error) {
//     if (error instanceof ZodError) {
//       return res.status(400).json({ message: error.issues });
//     }
//     return res.status(500).json({ message: error });
//   }
// };

// export const updateListing = async (req: AuthedRequest, res: Response) => {
//   const storeId = req.store?.storeId;

//   if (!storeId) {
//     return res.status(401).json({ message: "No storeId found" });
//   }

//   try {
//     const { listingId, ...updateData } = updateListingSchema.parse(req.body);

//     const listing = await prisma.listing.findUnique({
//       where: {
//         id: listingId,
//       },
//     });

//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }

//     if (listing.storeId !== storeId) {
//       return res
//         .status(403)
//         .json({ message: "You are not authorized to update this listing" });
//     }

//     const updatedListing = await prisma.listing.update({
//       where: {
//         id: listingId,
//       },
//       data: updateData,
//     });

//     return res.status(200).json({ data: updatedListing });
//   } catch (error) {
//     if (error instanceof ZodError) {
//       return res.status(400).json({ message: error.issues });
//     }
//     return res.status(500).json({ message: error });
//   }
// };

// export const deleteListing = async (req: AuthedRequest, res: Response) => {
//   const storeId = req.store?.storeId;

//   if (!storeId) {
//     return res.status(401).json({ message: "No storeId found" });
//   }

//   try {
//     const { listingId } = deleteListingSchema.parse(req.body);

//     const listing = await prisma.listing.findUnique({
//       where: {
//         id: listingId,
//       },
//     });

//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }

//     if (listing.storeId !== storeId) {
//       return res
//         .status(403)
//         .json({ message: "You are not authorized to delete this listing" });
//     }

//     await prisma.listing.delete({
//       where: {
//         id: listingId,
//       },
//     });

//     return res.status(204).send();
//   } catch (error) {
//     if (error instanceof ZodError) {
//       return res.status(400).json({ message: error.issues });
//     }
//     return res.status(500).json({ message: error });
//   }
// };
