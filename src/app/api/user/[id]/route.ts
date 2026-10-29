import { NextRequest, NextResponse } from "next/server";

const API = "https://jsonplaceholder.typicode.com/users";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, id: Number(id) }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 502 }
      );
    }

    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json(
      { error: "Unable to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, context: Context) {
  try {
    const { id } = await context.params;

    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, id });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete user" },
      { status: 500 }
    );
  }
}