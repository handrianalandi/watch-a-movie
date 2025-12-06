import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const search = searchParams.get("s");
  const type = searchParams.get("type");
  const page = searchParams.get("page") || "1";

  if (!search) {
    return NextResponse.json(
      { Response: "False", Error: "Search query is required" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    apikey: process.env.OMDB_API_KEY!,
    s: search,
    page,
  });

  if (type) {
    params.append("type", type);
  }

  try {
    const response = await fetch(
      `${process.env.OMDB_BASE_URL}?${params.toString()}`
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching from OMDB:", error);
    return NextResponse.json(
      { Response: "False", Error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}
