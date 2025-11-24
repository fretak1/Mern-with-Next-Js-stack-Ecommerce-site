import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import cloudinary from "../config/cloudinary";
import { prisma } from "../server";
import fs from "fs";
import { Prisma } from "@prisma/client";
import { sendEmail } from "../utils/sendEmail";

export const createProduct = async (req: any, res: Response) => {
  try {
    const {
      name,
      brand,
      description,
      category,
      gender,
      sizes,
      colors,
      price,
      stock,
      brandCategory,
      productType,
    } = req.body;

    const files = req.files as Express.Multer.File[];

    // Upload images to Cloudinary
    const uploadResults = await Promise.all(
      files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "ecommerce" })
      )
    );
    const imageUrls = uploadResults.map((r) => r.secure_url);

    // Create product in DB
    const newlyCreatedProduct = await prisma.product.create({
      data: {
        name,
        brand,
        brandCategory,
        description,
        category,
        gender,
        productType,
        sizes: sizes.split(","),
        colors: colors.split(","),
        price: parseFloat(price),
        stock: parseInt(stock),
        images: imageUrls,
        soldCount: 0,
        rating: 0,
      },
    });

    // Delete local files
    files.forEach((file) => fs.unlinkSync(file.path));

    // Fetch all subscribers
    const subscribers = await prisma.newsletter.findMany();

    // Email content
    const subject = `New Product Added: ${name}`;
    const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
    <p>Hello,</p>
    <p>A new product has been added:</p>

    <p><b>${name}</b></p>
    <p>${description}</p>
    <p><b>Price:</b> ${price} ETB</p>

    <p>
      Link: 
      <a href="https://mern-with-next-js-stack-ecommerce-s.vercel.app/products/${newlyCreatedProduct.id}">
        View Product
      </a>
    </p>

    <p>Thanks,<br>Ethio Market Team</p>
  </div>
`;



    // Send emails individually in parallel
    await Promise.all(
      subscribers.map((sub) => sendEmail(sub.email, subject, html))
    );

    res.status(201).json({
      success: true,
      message: "Product created and notification emails sent!",
      newlyCreatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the product.",
    });
  }
};

export const fetxhAllProductsForAdmin = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const allProducts = await prisma.product.findMany();
    res.status(201).json({
      allProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "some error occured!",
    });
  }
};

export const getProductById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: true,
      },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "some error occured!",
    });
  }
};

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      description,
      category,
      gender,
      sizes,
      colors,
      price,
      stock,
      rating,
      brandCategory,
      productType,
    } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        brand,
        description,
        category,
        brandCategory,
        productType,
        gender,
        sizes: sizes.split(","),
        colors: colors.split(","),
        price: parseFloat(price),
        stock: parseInt(stock),
        rating: parseInt(rating),
      },
    });

    res.status(200).json({ updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "some error occured!",
    });
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc", // newest first
      },
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "some error occured!",
    });
  }
};

export const getFilteredProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const categories = ((req.query.categories as string) || "")
      .split(",")
      .filter(Boolean);
    const brands = ((req.query.brands as string) || "")
      .split(",")
      .filter(Boolean);
    const sizes = ((req.query.sizes as string) || "")
      .split(",")
      .filter(Boolean);
    const colors = ((req.query.colors as string) || "")
      .split(",")
      .filter(Boolean);

    const search = (req.query.search as string) || "";
    const type = (req.query.type as string) || "";

    const minPrice = parseFloat(req.query.minPrice as string) || 0;
    const maxPrice =
      parseFloat(req.query.maxPrice as string) || Number.MAX_SAFE_INTEGER;

    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

    const skip = (page - 1) * limit;

    // Build filters
    const andFilters: any[] = [];

    if (categories.length > 0) {
      andFilters.push({ category: { in: categories, mode: "insensitive" } });
    }
    if (brands.length > 0) {
      andFilters.push({ brand: { in: brands, mode: "insensitive" } });
    }
    if (sizes.length > 0) {
      andFilters.push({ sizes: { hasSome: sizes } });
    }
    if (colors.length > 0) {
      andFilters.push({ colors: { hasSome: colors } });
    }
    if (search) {
      andFilters.push({ name: { contains: search, mode: "insensitive" } });
    }
    if (type) {
      andFilters.push({ productType: { equals: type, mode: "insensitive" } });
    }

    andFilters.push({ price: { gte: minPrice, lte: maxPrice } });

    const where: any = { AND: andFilters };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.product.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      products,
      currentPage: page,
      totalPage: Math.ceil(total / limit),
      totalProduct: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

export const addProductReview = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthenticated user" });
      return;
    }

    if (!rating) {
      res.status(400).json({ success: false, message: "Rating is required" });
      return;
    }

    // ✅ Check if this user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: { user_product_unique: { userId, productId } },
    });

    if (existingReview) {
      // ✅ Update existing review
      await prisma.review.update({
        where: { user_product_unique: { userId, productId } },
        data: { rating: parseInt(rating), comment },
      });
    } else {
      // ✅ Create new review
      await prisma.review.create({
        data: {
          userId,
          productId,
          rating: parseInt(rating),
          comment,
        },
      });
    }

    // ✅ Recalculate product average rating
    const reviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: { rating: avgRating },
    });

    res.status(201).json({
      success: true,
      message: existingReview
        ? "Review updated successfully"
        : "Review added successfully",
      averageRating: avgRating,
    });
  } catch (error: any) {
    console.error("Error adding review:", error);

    if (error.code === "P2002") {
      // Prisma duplicate unique key error fallback
      res.status(400).json({
        success: false,
        message: "You already reviewed this product.",
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to add or update review" });
    }
  }
};
