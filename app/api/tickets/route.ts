import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, requesterEmail } = body;

    if (!title || !description || !requesterEmail) {
      return NextResponse.json(
        { error: "Title, description, and email are required." },
        { status: 400 }
      );
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        requesterEmail,
        category: "Software",
        priority: "Medium",
        status: "Open",
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error: any) {
    console.error("Database error in /api/tickets POST:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create ticket" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tickets);
  } catch (error: any) {
    console.error("Database error in /api/tickets GET:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load tickets" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, priority } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Ticket ID is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Database error in /api/tickets PATCH:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update ticket" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Ticket ID is required" },
        { status: 400 }
      );
    }

    await prisma.ticket.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: "Ticket deleted successfully" });
  } catch (error: any) {
    console.error("Database error in /api/tickets DELETE:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete ticket" },
      { status: 500 }
    );
  }
}