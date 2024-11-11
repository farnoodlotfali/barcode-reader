import { NextResponse } from "next/server";
import { PagesUrls } from "./constants/PagesUrl";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  // redirect user to auth, due to token or role
  if (!token && request.nextUrl.pathname !== PagesUrls.Login) {
    return NextResponse.redirect(new URL(PagesUrls.Login, request.url));
  }
  if (token && request.nextUrl.pathname === PagesUrls.Login) {
    return NextResponse.redirect(new URL(PagesUrls.Home, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
