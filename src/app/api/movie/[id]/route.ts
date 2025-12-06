import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { response: "False", Error: "IMDb ID is required" },
      { status: 400 }
    );
  }

  const queryParams = new URLSearchParams({
    apikey: process.env.OMDB_API_KEY!,
    i: id,
    plot: "full",
  });

  try {
    const response = await fetch(
      `${process.env.OMDB_BASE_URL}?${queryParams.toString()}`
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return NextResponse.json(
      { response: "False", Error: "Failed to fetch movie details" },
      { status: 500 }
    );
  }
}
