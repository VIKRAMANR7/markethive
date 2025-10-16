"use server";

import { SubCategory } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const upsertSubCategory = async (subCategory: SubCategory) => {
  try {
    // Get current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Verify admin permission
    if (user.privateMetadata.role !== "ADMIN")
      throw new Error("Unauthorized Access: Admin Privileges Required for Entry.");

    // Ensure SubCategory data is provided
    if (!subCategory) throw new Error("Please provide subCategory data.");

    // Throw error if category with same name or URL already exists
    const existingSubCategory = await prisma.subCategory.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: subCategory.name }, { url: subCategory.url }],
          },
          {
            NOT: {
              id: subCategory.id,
            },
          },
        ],
      },
    });

    // Throw error if category with same name or URL already exists
    if (existingSubCategory) {
      let errorMessage = "";
      if (existingSubCategory.name === subCategory.name) {
        errorMessage = "A SubCategory with the same name already exists";
      } else if (existingSubCategory.url === subCategory.url) {
        errorMessage = "A SubCategory with the same URL already exists";
      }
      throw new Error(errorMessage);
    }

    // Upsert SubCategory into the database
    const subCategoryDetails = await prisma.subCategory.upsert({
      where: {
        id: subCategory.id,
      },
      update: subCategory,
      create: subCategory,
    });
    return subCategoryDetails;
  } catch (error) {
    throw error;
  }
};

export const getAllSubCategories = async () => {
  const subCategories = await prisma.subCategory.findMany({
    include: {
      category: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return subCategories;
};

export const getSubCategory = async (subCategoryId: string) => {
  if (!subCategoryId) throw new Error("Please provide suCategory ID.");

  // Retrieve subCategory
  const subCategory = await prisma.subCategory.findUnique({
    where: {
      id: subCategoryId,
    },
  });
  return subCategory;
};

export const deleteSubCategory = async (subCategoryId: string) => {
  // Get current user
  const user = await currentUser();

  // Check if user is authenticated
  if (!user) throw new Error("Unauthenticated.");

  // Verify admin permission
  if (user.privateMetadata.role !== "ADMIN")
    throw new Error("Unauthorized Access: Admin Privileges Required for Entry.");

  // Ensure subCategory ID is provided
  if (!subCategoryId) throw new Error("Please provide category ID.");

  // Delete subCategory from the database
  const response = await prisma.subCategory.delete({
    where: {
      id: subCategoryId,
    },
  });
  return response;
};

export const getSubcategories = async (
  limit: number | null,
  random: boolean = false
): Promise<SubCategory[]> => {
  // Define SortOrder enum
  enum SortOrder {
    asc = "asc",
    desc = "desc",
  }
  try {
    // Define the query options
    const queryOptions = {
      take: limit || undefined, // Use the provided limit or undefined for no limit
      orderBy: random ? { createdAt: SortOrder.desc } : undefined, // Use SortOrder for ordering
    };

    // If random selection is required, use a raw query to randomize
    if (random) {
      const subcategories = await prisma.$queryRaw<SubCategory[]>`
    SELECT * FROM SubCategory
    ORDER BY RAND()
    LIMIT ${limit || 10}
    `;
      return subcategories;
    } else {
      // Otherwise, fetch subcategories based on the defined query options
      const subcategories = await prisma.subCategory.findMany(queryOptions);
      return subcategories;
    }
  } catch (error) {
    // Log and re-throw any errors
    throw error;
  }
};
