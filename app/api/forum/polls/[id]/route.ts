import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { auth } from "@/auth";
import Poll from "@/models/Poll";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    const poll = await Poll.findById(id);
    
    if (!poll) {
      return NextResponse.json(
        { success: false, error: "Poll not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: poll });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch poll" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const poll = await Poll.findById(id);
    
    if (!poll) {
      return NextResponse.json(
        { success: false, error: "Poll not found" },
        { status: 404 }
      );
    }

    if (body.vote !== undefined && body.usn) {
      const { vote: optionIndex, usn } = body;
      
      const hasVoted = poll.votedBy.find((v: { usn: string }) => v.usn === usn);
      
      if (hasVoted) {
        return NextResponse.json(
          { success: false, error: "You have already voted in this poll" },
          { status: 400 }
        );
      }

      if (poll.status !== "Active" || new Date() > new Date(poll.expiresAt)) {
        return NextResponse.json(
          { success: false, error: "This poll is no longer active" },
          { status: 400 }
        );
      }

      if (optionIndex < 0 || optionIndex >= poll.options.length) {
        return NextResponse.json(
          { success: false, error: "Invalid option selected" },
          { status: 400 }
        );
      }

      poll.options[optionIndex].votes += 1;
      poll.totalVotes += 1;
      poll.votedBy.push({ usn, optionIndex, votedAt: new Date() });
      
      await poll.save({ validateModifiedOnly: true });
      return NextResponse.json({ success: true, data: poll });
    } else if (body.status) {
      poll.status = body.status;
      await poll.save({ validateModifiedOnly: true });
      return NextResponse.json({ success: true, data: poll });
    }

    return NextResponse.json(
      { success: false, error: "Invalid update request" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update poll" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    const poll = await Poll.findByIdAndDelete(id);
    
    if (!poll) {
      return NextResponse.json(
        { success: false, error: "Poll not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Poll deleted successfully" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete poll" },
      { status: 500 }
    );
  }
};
