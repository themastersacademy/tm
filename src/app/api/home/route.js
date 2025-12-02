import {
  getActiveAnnouncements,
  getHomePageSettings,
} from "@/src/util/homepage/homePageController";
import { getAllBanners } from "@/src/libs/home/homePageControllers";
import { getGoalList } from "@/src/libs/goal/goalController";

export async function GET(request) {
  try {
    // Fetch all homepage data concurrently
    const [bannersData, settingsData, announcementsData, goalsData] =
      await Promise.all([
        getAllBanners(),
        getHomePageSettings(),
        getActiveAnnouncements(),
        getGoalList(),
      ]);

    // Get featured goals details
    const featuredGoalIDs = settingsData.data?.featuredGoalIDs || [];
    const allGoals = goalsData.data || [];

    // Filter only live featured goals
    const featuredGoals = allGoals
      .filter((goal) => featuredGoalIDs.includes(goal.goalID) && goal.isLive)
      .map((goal) => ({
        goalID: goal.goalID,
        title: goal.title,
        icon: goal.icon,
        tagline: goal.tagline,
        description: goal.description,
        bannerImage: goal.bannerImage,
      }));

    return Response.json(
      {
        success: true,
        data: {
          banners: bannersData.data || [],
          featuredGoals: featuredGoals,
          announcements: announcementsData.data || [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
