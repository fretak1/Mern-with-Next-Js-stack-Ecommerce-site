import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";

export const createAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { name, city, country, address, postalCode, phone, isDefault } =
      req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthenticated user",
      });

      return;
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: {
          isDefault: false,
        },
      });
    }

    const newlyCreatedAddress = await prisma.address.create({
      data: {
        userId,
        name,
        address,
        city,
        country,
        phone,
        postalCode,
        isDefault: isDefault || false,
      },
    });

    res.status(201).json({
      success: true,
      address: newlyCreatedAddress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

export const getAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthenticated user",
      });

      return;
    }

    const allAddress = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(201).json({
      success: true,
      address: allAddress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

export const updateAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { name, city, country, address, postalCode, phone, isDefault } =
      req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthenticated user",
      });

      return;
    }

    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      res.status(404).json({
        success: false,
        message: "Address Not Found",
      });

      return;
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: {
          isDefault: false,
        },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id, userId },
      data: {
        userId,
        name,
        address,
        city,
        country,
        phone,
        postalCode,
        isDefault: isDefault || false,
      },
    });

    res.status(200).json({
      success: true,
      address: updatedAddress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

export const deleteAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthenticated user",
      });

      return;
    }

    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      res.status(404).json({
        success: false,
        message: "Address Not Found",
      });

      return;
    }

    await prisma.address.delete({
      where: { id, userId },
    });

    res.status(201).json({
      success: true,
      message: "Address Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};
