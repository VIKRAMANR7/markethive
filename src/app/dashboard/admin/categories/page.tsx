//Queries

import { getAllCategories } from "@/queries/category";

export default async function AdminCategoriesPage() {
  //Fetching stores data from the database
  const categories = await getAllCategories();

  //Checking if no categories are found
  if (!categories) return null;
  return <div>Admin Categories page</div>;
}
