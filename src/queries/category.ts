"use server";

import { Category } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const upsertCategory = async (category: Category) => {
  try {
    // Get current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    if (user.privateMetadata.role !== "ADMIN") {
      throw new Error("Unauthorized Access: Admin Privileges Required for Entry.");
    }

    // Ensure category data is provided
    if (!category) throw new Error("Please provide category data.");

    // Check if category with same name or URL already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: category.name }, { url: category.url }],
          },
          {
            NOT: {
              id: category.id,
            },
          },
        ],
      },
    });

    // Throw error if category with same name or URL already exists
    if (existingCategory) {
      let errorMessage = "";
      if (existingCategory.name === category.name) {
        errorMessage = "A category with the same name already exists";
      } else if (existingCategory.url === category.url) {
        errorMessage = "A category with the same URL already exists";
      }
      throw new Error(errorMessage);
    }

    // Destructure to get the fields
    const { id, name, image, url, featured } = category;

    // Upsert category into the database
    const categoryDetails = await prisma.category.upsert({
      where: {
        id,
      },
      update: {
        name,
        image,
        url,
        featured,
        updatedAt: new Date(),
      },
      create: {
        id,
        name,
        image,
        url,
        featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return categoryDetails;
  } catch (error) {
    throw error;
  }
};

export const getAllCategories = async () => {
  //Retrieve all categories from the database
  const categories = await prisma.category.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
  return categories;
};
