import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  const pathname = req.nextUrl.pathname;

  const publicRoutes = ["/login", "/cadastro", "/auth/callback"];

  if (publicRoutes.includes(pathname)) {
    if (data.user) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  const protectedRoutes = ["/dashboard", "/contratos", "/gerar", "/perfil"];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!data.user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/cadastro",
    "/auth/callback",
    "/dashboard/:path*",
    "/contratos/:path*",
    "/gerar/:path*",
    "/perfil/:path*",
  ],
};
