import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { AuthedRequest } from "../types";
import {
  createAccountSchema,
  deleteAccountSchema,
  updateAccountSchema,
} from "../schemas/account.schema";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export const getAccounts = async (req: AuthedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "No userId found" });
    }

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 25;
    const skip = (page - 1) * pageSize;

    const accounts = await prisma.account.findMany({
      where: {
        userId,
      },
      take: pageSize,
      skip: skip,
      select: {
        id: true,
        name: true,
        type: true,
        currency: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalAccounts = await prisma.account.count({
      where: {
        userId,
      },
    });

    return res.status(200).json({
      data: accounts,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(totalAccounts / pageSize),
        totalItems: totalAccounts,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const createAccount = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "No userId found" });
  }

  try {
    const validatedData = createAccountSchema.parse(req.body);

    const account = await prisma.account.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    return res.status(201).json({ data: account });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.issues });
    }
    return res.status(500).json({ message: error });
  }
};

export const updateAccount = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "No userId found" });
  }

  try {
    const { accountId, ...updateData } = updateAccountSchema.parse(req.body);

    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
        userId,
      },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this account" });
    }

    const updatedAccount = await prisma.account.update({
      where: {
        id: accountId,
        userId,
      },
      data: updateData,
    });

    return res.status(200).json({ data: updatedAccount });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.issues });
    }
    return res.status(500).json({ message: error });
  }
};

export const deleteAccount = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "No userId found" });
  }

  try {
    const { accountId } = deleteAccountSchema.parse(req.body);

    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this account" });
    }

    await prisma.account.delete({
      where: {
        id: accountId,
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
