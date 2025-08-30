import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { AuthedRequest } from "../types";
import {
  createSubcategorySchema,
  deleteSubcategorySchema,
  updateSubcategorySchema,
} from "../schemas/subcategory.schema";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export const getSubcategories = async (req: AuthedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "No userId found" });
    }

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 25;
    const skip = (page - 1) * pageSize;
    const categoryId = req.query.categoryId as string;

    const whereClause: any = {
      userId,
    };

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    const subcategories = await prisma.subcategory.findMany({
      where: {
        userId,
      },
      take: pageSize,
      skip: skip,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
          },
        },
        transactions: {
          select: {
            id: true,
            amount: true,
            date: true,
            description: true,
          },
          take: 5, // Limit transactions for performance
        },
      },
    });

    const totalSubcategories = await prisma.subcategory.count({
      where: {
        userId,
      },
    });

    return res.status(200).json({
      data: subcategories,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(totalSubcategories / pageSize),
        totalItems: totalSubcategories,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const createSubcategory = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "No userId found" });
  }

  try {
    const validatedData = createSubcategorySchema.parse(req.body);

    // Verify the category exists and belongs to the user
    const category = await prisma.category.findUnique({
      where: {
        id: validatedData.categoryId,
        userId,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        ...validatedData,
        userId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
          },
        },
      },
    });

    return res.status(201).json({ data: subcategory });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.issues });
    }
    return res.status(500).json({ message: error });
  }
};

export const updateSubcategory = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "No userId found" });
  }

  try {
    const { id, ...updateData } = updateSubcategorySchema.parse(req.body);

    const subcategory = await prisma.subcategory.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // If updating categoryId, verify it exists and belongs to the user
    if (updateData.categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: updateData.categoryId,
          userId,
        },
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const updatedSubcategory = await prisma.subcategory.update({
      where: {
        id,
        userId,
      },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
          },
        },
      },
    });

    return res.status(200).json({ data: updatedSubcategory });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.issues });
    }
    return res.status(500).json({ message: error });
  }
};

export const deleteSubcategory = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "No userId found" });
  }

  try {
    const { id } = deleteSubcategorySchema.parse(req.body);

    const subcategory = await prisma.subcategory.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        transactions: true,
      },
    });

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Check if subcategory has transactions
    if (subcategory.transactions.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete subcategory with transactions. Please delete or reassign transactions first.",
      });
    }

    await prisma.subcategory.delete({
      where: {
        id,
        userId,
      },
    });

    return res.status(204).send();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.issues });
    }
    return res.status(500).json({ message: error });
  }
};