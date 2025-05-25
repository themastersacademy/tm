import { getAllBanners } from "@/src/libs/home/homePageControllers";

export async function GET(req) {
  try {
    const response = await getAllBanners();
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
