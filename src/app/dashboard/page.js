"use server";
import { getSession } from "@/src/utils/serverSession";
import { getAllGoalEnrollments } from "@/src/libs/goalEnrollment/goalEnrollController";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  // 1) Check auth
  const session = await getSession();
  if (!session?.isAuthenticated) {
    redirect("/signIn");
  }

  // 2) Fetch all enrolled goals for this user
  const response = await getAllGoalEnrollments({
    userID: session.id,
  });

  const goalEnrollments = response.data;

  if (!Array.isArray(goalEnrollments) || goalEnrollments.length === 0) {
    redirect("/profile-setup?goal=true");
  }

  // 4) Otherwise, redirect to the first enrollment’s dashboard
  const firstEnrollmentId = goalEnrollments[0].id;
  redirect(`/dashboard/${firstEnrollmentId}`);
}
