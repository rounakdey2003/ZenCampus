import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Poll from "@/models/Poll";

// GET - Get single poll
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
}

// PUT - Update poll (for voting or status change)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    // Handle voting
    if (body.vote !== undefined && body.usn) {
      const { vote: optionIndex, usn } = body;
      
      // Check if user already voted
      const hasVoted = poll.votedBy.find((v: { usn: string }) => v.usn === usn);
      
      if (hasVoted) {
        return NextResponse.json(
          { success: false, error: "You have already voted in this poll" },
          { status: 400 }
        );
      }

      // Check if poll is still active
      if (poll.status !== "Active" || new Date() > new Date(poll.expiresAt)) {
        return NextResponse.json(
          { success: false, error: "This poll is no longer active" },
          { status: 400 }
        );
      }

      // Check if option index is valid
      if (optionIndex < 0 || optionIndex >= poll.options.length) {
        return NextResponse.json(
          { success: false, error: "Invalid option selected" },
          { status: 400 }
        );
      }

      // Add vote
      poll.options[optionIndex].votes += 1;
      poll.totalVotes += 1;
      poll.votedBy.push({ usn, optionIndex, votedAt: new Date() });
      
      await poll.save({ validateModifiedOnly: true });
      return NextResponse.json({ success: true, data: poll });
    }

    // Handle status update (admin only)
    if (body.status) {
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
}

// DELETE - Delete poll (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
}
