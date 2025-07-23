"use server";
import { getSession } from "@/src/utils/serverSession";
import { getAllGoalEnrollments } from "@/src/libs/goalEnrollment/goalEnrollController";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Dashboard({ searchParams }) {
  const path = await searchParams?.path;
  console.log(path);
  // 1) Check auth
  const session = await getSession();
  if (!session?.isAuthenticated) {
    return redirect("/signIn");
  }

  // 2) Fetch all enrolled goals for this user
  const response = await getAllGoalEnrollments({
    userID: session.id,
  });

  const goalEnrollments = response.data;

  if (!Array.isArray(goalEnrollments) || goalEnrollments.length === 0) {
    return redirect("/profile-setup?goal=true");
  }

  const selectedGoalID = await cookies()?.get("selectedGoalID")?.value;

  if (
    selectedGoalID &&
    goalEnrollments.some((goal) => goal.id === selectedGoalID)
  ) {
    if (path) {
      redirect(`/dashboard/${selectedGoalID}/${path}`);
    }
    return redirect(`/dashboard/${selectedGoalID}`);
  }

  // 4) Otherwise, redirect to the first enrollment’s dashboard
  const firstEnrollmentId = goalEnrollments[0].id;
  return redirect(`/dashboard/${firstEnrollmentId}`);
}
