"use server";

import { db } from "@/db";
import { needs, needVolunteers } from "@/db/schema";
import { getServerSession } from "@/lib/auth/get-session";
import { eq, and, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function createNeed(data: {
  title: string;
  description: string;
  category: string;
  city: string;
  phoneWhatsApp?: string;
}) {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  try {
    await db.insert(needs).values({
      id: `need_${Date.now()}`,
      userId: session.user.id,
      title: data.title,
      description: data.description,
      category: data.category,
      city: data.city,
      phoneWhatsApp: data.phoneWhatsApp || null,
      volunteerCount: 0,
      isResolved: false,
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating need:", error);
    return { success: false, error: "Failed to create need" };
  }
}

export async function volunteerForNeed(needId: string) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if already volunteered
    const existing = await db.query.needVolunteers.findFirst({
      where: and(
        eq(needVolunteers.needId, needId),
        eq(needVolunteers.userId, session.user.id)
      ),
    });

    if (existing) {
      return { success: false, error: "Already volunteered for this need" };
    }

    // Add volunteer
    await db.insert(needVolunteers).values({
      id: `volunteer_${Date.now()}`,
      needId,
      userId: session.user.id,
    });

    // Increment volunteer count
    await db
      .update(needs)
      .set({ volunteerCount: sql`${needs.volunteerCount} + 1` })
      .where(eq(needs.id, needId));

    return { success: true };
  } catch (error) {
    console.error("Error volunteering:", error);
    return { success: false, error: "Failed to volunteer. Please try again." };
  }
}

export async function unvolunteerForNeed(needId: string) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Remove volunteer
    await db.delete(needVolunteers).where(
      and(
        eq(needVolunteers.needId, needId),
        eq(needVolunteers.userId, session.user.id)
      )
    );

    // Decrement volunteer count
    await db
      .update(needs)
      .set({ volunteerCount: sql`${needs.volunteerCount} - 1` })
      .where(eq(needs.id, needId));

    return { success: true };
  } catch (error) {
    console.error("Error unvolunteering:", error);
    return { success: false, error: "Failed to remove volunteering. Please try again." };
  }
}

export async function resolveNeed(needId: string) {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  try {
    // Check if user is the owner
    const need = await db.query.needs.findFirst({
      where: eq(needs.id, needId),
    });

    if (!need || need.userId !== session.user.id) {
      return { success: false, error: "Not authorized" };
    }

    // Mark as resolved
    await db.update(needs).set({ isResolved: true }).where(eq(needs.id, needId));

    return { success: true };
  } catch (error) {
    console.error("Error resolving need:", error);
    return { success: false, error: "Failed to resolve need" };
  }
}

export async function deleteNeed(needId: string) {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  try {
    // Check if user is the owner
    const need = await db.query.needs.findFirst({
      where: eq(needs.id, needId),
    });

    if (!need || need.userId !== session.user.id) {
      return { success: false, error: "Not authorized" };
    }

    // Delete need (cascades to volunteers)
    await db.delete(needs).where(eq(needs.id, needId));

    return { success: true };
  } catch (error) {
    console.error("Error deleting need:", error);
    return { success: false, error: "Failed to delete need" };
  }
}
