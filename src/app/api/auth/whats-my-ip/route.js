export async function GET(request) {
  const ip =
    request.ip ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  console.log("ip", ip);
  return Response.json({ ip });
}
