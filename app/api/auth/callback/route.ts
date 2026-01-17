import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) return NextResponse.json({ error: "Code não fornecido" }, { status: 400 });

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", process.env.ML_APP_ID!);
  params.append("client_secret", process.env.ML_APP_SECRET!);
  params.append("code", code);
  params.append("redirect_uri", process.env.ML_REDIRECT_URI!);

  try {
    const res = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const data = await res.json();
    // data.access_token é o token que vamos usar
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Falha ao gerar token" }, { status: 500 });
  }
}
