import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("access_token");
  const offset = req.nextUrl.searchParams.get("offset") || "0";
  const searchType = req.nextUrl.searchParams.get("search_type") || "scan";

  if (!token) return NextResponse.json({ error: "Token necessário" }, { status: 401 });

  try {
    const res = await fetch(
      `https://api.mercadolibre.com/users/me/items/search?search_type=${searchType}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Erro API ML:", res.status, text);
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
