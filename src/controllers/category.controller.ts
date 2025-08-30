import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { AuthedRequest } from "../types";
import {
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export const getCategories = async (req: AuthedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "No userId found" });
    }

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 25;
    const skip = (page - 1) * pageSize;

    const categories = await prisma.category.findMany({
      where: {
        userId,
      },
      take: pageSize,
      skip: skip,
      include: {
        subcategories: {
          include: {
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

    const totalCategories = await prisma.category.count({
      where: {
        userId,
      },
    });

    return res.status(200).json({
      data: categories,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(totalCategories / pageSize),
        totalItems: totalCategories,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const createCategory = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "No userId found" });
  }

  try {
    const validatedData = createCategorySchema.parse(req.body);

    const category = await prisma.category.create({
      data: {
        ...validatedData,
        userId,
      },
      include: {
        subcategories: true,
      },
    });

    return res.status(201).json({ data: category });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.issues });
    }
    return res.status(500).json({ message: error });
  }
};

export const updateCategory = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "No userId found" });
  }

  try {
    const { id, ...updateData } = updateCategorySchema.parse(req.body);

    const category = await prisma.category.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id,
        userId,
      },
      data: updateData,
      include: {
        subcategories: true,
      },
    });

    return res.status(200).json({ data: updatedCategory });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.issues });
    }
    return res.status(500).json({ message: error });
  }
};

export const deleteCategory = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "No userId found" });
  }

  try {
    const { id } = deleteCategorySchema.parse(req.body);

    const category = await prisma.category.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        subcategories: true,
        transactions: true,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if category has subcategories or transactions
    if (category.subcategories.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete category with subcategories. Please delete or reassign subcategories first.",
      });
    }

    if (category.transactions.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete category with transactions. Please delete or reassign transactions first.",
      });
    }

    await prisma.category.delete({
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


