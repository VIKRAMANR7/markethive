import { currentUser } from "@clerk/nextjs/server";
import { ReactNode } from "react";

export default async function SellerDashboardLayout({ children }: { children: ReactNode }) {
  //Block non sellers from accessing the seller dashboard

  const user = await currentUser();
  return <div>{children}</div>;
}
