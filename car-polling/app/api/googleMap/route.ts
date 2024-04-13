import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  const Params = req.nextUrl.searchParams;
  const source = Params.get("source");
  const destination = Params.get("destination");

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination}&origins=${source}&units=KM&key=${process.env.GOOGLE_API}`
    );
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const data = await response.json();
    const distance = data.rows[0].elements[0].distance.text;
    return NextResponse.json({ data: distance });
  } catch (error) {
    return NextResponse.json({ error });
  }
};
