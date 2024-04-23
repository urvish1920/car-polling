import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.has("access_token");
  if (!currentUser)
    return NextResponse.redirect(new URL("/signIn", request.url));
  return NextResponse.next();
}
export const config = {
  matcher: ["/", "/findRides","/myRide","/planRide","/publishNewCar","/profile"],
};
