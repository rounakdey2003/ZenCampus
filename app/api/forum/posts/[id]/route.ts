import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ForumPost from "@/models/ForumPost";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const body = await request.json();
    
    // Handle reply action
    if (body.action === "reply" && body.reply) {
      const post = await ForumPost.findById(id);
      
      if (!post) {
        return NextResponse.json(
          { success: false, error: "Post not found" },
          { status: 404 }
        );
      }
      
      const updatedPost = await ForumPost.findByIdAndUpdate(
        id,
        {
          $push: { 
            replies: {
              author: body.reply.author,
              authorUSN: body.reply.authorUSN,
              content: body.reply.content,
              createdAt: new Date()
            }
          },
          $inc: { comments: 1 },
          lastActivity: new Date(),
        },
        { new: true }
      );
      
      return NextResponse.json({ success: true, data: updatedPost });
    }
    
    // Handle like/unlike logic
    if (body.action === "like" && body.usn) {
      const post = await ForumPost.findById(id);
      
      if (!post) {
        return NextResponse.json(
          { success: false, error: "Post not found" },
          { status: 404 }
        );
      }
      
      const likedBy = post.likedBy || [];
      const hasLiked = likedBy.includes(body.usn);
      
      let updatedPost;
      if (hasLiked) {
        // Unlike
        updatedPost = await ForumPost.findByIdAndUpdate(
          id,
          {
            $pull: { likedBy: body.usn },
            $inc: { likes: -1 },
            lastActivity: new Date(),
          },
          { new: true }
        );
      } else {
        // Like
        updatedPost = await ForumPost.findByIdAndUpdate(
          id,
          {
            $addToSet: { likedBy: body.usn },
            $inc: { likes: 1 },
            lastActivity: new Date(),
          },
          { new: true }
        );
      }
      
      return NextResponse.json({ success: true, data: updatedPost });
    }
    
    // Handle regular updates
    const post = await ForumPost.findByIdAndUpdate(
      id,
      { ...body, lastActivity: new Date() },
      { new: true }
    );
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("Error updating forum post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update forum post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const post = await ForumPost.findByIdAndDelete(id);
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting forum post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete forum post" },
      { status: 500 }
    );
  }
}
