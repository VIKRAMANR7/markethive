import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Get user and redirect depending on role
  const user = await currentUser();

  // If no role or role is USER, redirect to homepage
  if (!user?.privateMetadata?.role || user?.privateMetadata.role === "USER") {
    redirect("/");
  }

  // If ADMIN, redirect to admin dashboard
  if (user?.privateMetadata.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  // If SELLER, redirect to seller dashboard
  if (user?.privateMetadata.role === "SELLER") {
    redirect("/dashboard/seller");
  }
}
