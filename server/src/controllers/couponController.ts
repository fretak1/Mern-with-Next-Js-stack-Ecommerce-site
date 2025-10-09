import { Request, Response } from "express";
import { prisma } from "../server";

export const createCoupon = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code, discountPercent, startDate, endDate, usageLimit } = req.body;

    const newlyCreatedCoupon = await prisma.coupon.create({
      data: {
        code,
        discountPercent: parseInt(discountPercent),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        usageLimit: parseInt(usageLimit),
        usageCount: 0,
      },
    });

    res.status(201).json({
      sucess: true,
      message: "Coupon Created Successfully",
      coupon: newlyCreatedCoupon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to Create Coupon",
    });
  }
};

export const fetchAllCoupons = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fetchAllCouponsList = await prisma.coupon.findMany({
      orderBy: { createdAt: "asc" },
    });

    res.status(201).json({
      sucess: true,
      couponList: fetchAllCouponsList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to Fetch Coupons",
    });
  }
};

export const deleteCoupon = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.coupon.delete({
      where: { id },
    });

    res.status(201).json({
      sucess: true,
      message: "coupon deleted Successfully",
      id: id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete Coupon ",
    });
  }
};
