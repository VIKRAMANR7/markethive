import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Verify the webhook
    const evt = await verifyWebhook(req);

    const eventType = evt.type;
    const { id } = evt.data;

    console.log(`Received webhook with ID ${id} and event type: ${eventType}`);

    // Handle user.created AND user.updated events
    if (evt.type === "user.created" || evt.type === "user.updated") {
      const { id, email_addresses, image_url, first_name, last_name } = evt.data;

      // Validate required fields
      if (!id || !email_addresses?.[0]?.email_address) {
        console.error("Missing required user data");
        return new Response("Missing required data", { status: 400 });
      }

      // Upsert user in database (handles both create and update)
      const dbUser = await prisma.user.upsert({
        where: {
          email: email_addresses[0].email_address,
        },
        update: {
          name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
          picture: image_url || "",
          // Note: Role is NOT updated here because Clerk is the source of the update
          // We need to read the role from the database, not update it
        },
        create: {
          id: id,
          name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
          email: email_addresses[0].email_address,
          picture: image_url || "",
          role: "USER",
        },
      });

      console.log("✅ User upserted in database:", dbUser.id);

      const client = await clerkClient();
      await client.users.updateUserMetadata(id, {
        privateMetadata: {
          role: dbUser.role,
        },
      });

      console.log("✅ Clerk metadata updated with role:", dbUser.role);
    }

    // Handle user.deleted event
    if (evt.type === "user.deleted") {
      const { id } = evt.data;

      if (!id) {
        console.error("Missing user ID for deletion");
        return new Response("Missing user ID", { status: 400 });
      }

      await prisma.user.delete({
        where: {
          id: id,
        },
      });

      console.log("✅ User deleted from database:", id);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("❌ Error processing webhook:", err);
    return new Response("Error processing webhook", { status: 400 });
  }
}
