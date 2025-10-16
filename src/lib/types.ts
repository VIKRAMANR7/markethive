import { Prisma } from "@/generated/prisma";
import { getAllSubCategories } from "@/queries/subCategory";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

//Subcategory + parent category
export type SubCategoryWithCategoryType = Prisma.PromiseReturnType<typeof getAllSubCategories>[0];
