import { NextResponse } from "next/server";
import { getHomePageSettings } from "@/src/libs/homepage/homePageController";
import { getGoalList } from "@/src/libs/goal/goalController";

export async function GET() {
  try {
    // Get featured goal IDs
    const settingsResult = await getHomePageSettings();
    const featuredGoalIDs = settingsResult.data.featuredGoalIDs || [];

    if (featuredGoalIDs.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Get all goals
    const goalsResult = await getGoalList();

    // Filter to only featured goals
    const featuredGoals = goalsResult.data.filter((goal) =>
      featuredGoalIDs.includes(goal.id)
    );

    return NextResponse.json({
      success: true,
      data: featuredGoals,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
