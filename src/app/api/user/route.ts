import { NextRequest, NextResponse } from "next/server";

const API = "https://jsonplaceholder.typicode.com/users";

export async function GET() {
  try {
    const res = await fetch(API, { cache: "no-store" });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 502 }
      );
    }

    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch users" },
      { status: 502 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 502 }
      );
    }

    return NextResponse.json(await res.json(), { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create user" },
      { status: 500 }
    );
  }
}