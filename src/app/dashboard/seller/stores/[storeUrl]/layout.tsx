import Header from "@/components/dashboard/header/header";
import { Sidebar } from "@/components/dashboard/sidebar/sidebar";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function SellerStoreDashboardLayout({ children }: { children: ReactNode }) {
  //Fetch the current user.If the user is not authenticated redirect to homepage
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  //Retrieve the list of stores associated with the authenticated user
  const stores = await prisma.store.findMany({
    where: {
      userId: user.id,
    },
  });
  return (
    <div className="w-full h-full flex">
      <Sidebar stores={stores} />
      <div className="w-full ml-[300px]">
        <Header />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
}
