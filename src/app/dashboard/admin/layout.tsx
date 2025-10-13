import Header from "@/components/dashboard/header/header";
import { Sidebar } from "@/components/dashboard/sidebar/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  //Block non admins from accessing the dashboard
  const user = await currentUser();
  console.log("User ID:", user?.id);
  console.log("Private Metadata:", user?.privateMetadata);
  console.log("Role:", user?.privateMetadata?.role);
  if (!user || user.privateMetadata.role !== "ADMIN") {
    console.log("Access denied - redirecting to home");
    redirect("/");
  }
  return (
    <div className="w-full h-full">
      {/* Sidebar */}
      <Sidebar />
      <div className="w-full ml-[300px]">
        {/* Header */}
        <Header />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
}
