import { z } from "zod";
import { MOBILE_REGEX, USN_REGEX } from "@/lib/utils";

// Auth Schemas
export const loginSchema = z.object({
  usn: z
    .string()
    .min(1, "USN is required")
    .max(16, "USN must be at most 16 characters")
    .regex(USN_REGEX, "USN must be alphanumeric"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  usn: z
    .string()
    .min(1, "USN is required")
    .max(16, "USN must be at most 16 characters")
    .regex(USN_REGEX, "USN must be alphanumeric"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  mobile: z
    .string()
    .regex(MOBILE_REGEX, "Mobile number must be exactly 10 digits"),
});







// Machine Schemas
export const bookMachineSchema = z.object({
  machineNumber: z.number().int().positive(),
  durationMinutes: z.number().int().positive(),
  usn: z.string().min(1),
});





// Complaint Schemas
export const createComplaintSchema = z.object({
  category: z.enum(["electrical", "plumbing", "carpentry", "room", "bathroom"]),
  usn: z.string().min(1),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
});

// Notice Schemas
export const createNoticeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  priority: z.enum(["general", "important", "urgent"]),
  postedBy: z.string().min(1, "Posted by is required"),
});

// Menu Item Schemas
export const createMenuItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  type: z.enum(["veg", "non-veg"]),
  mealType: z.enum(["breakfast", "lunch", "snacks", "dinner"]),
  availableFrom: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  availableTo: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  available: z.boolean().default(true),
});

// Canteen Order Schemas
export const createOrderSchema = z.object({
  userUSN: z.string().min(1),
  userName: z.string().min(1),
  itemId: z.string().min(1),
  quantity: z.number().int().positive(),
  roomNumber: z.string().min(1, "Room number is required"),
  instructions: z.string().optional(),
});

// Student Forum Schemas
export const createDiscussionSchema = z.object({
  usn: z.string().min(1),
  userName: z.string().min(1),
  type: z.enum(["public", "anonymous"]),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

export const createCommentSchema = z.object({
  usn: z.string().min(1),
  userName: z.string().min(1),
  comment: z.string().min(1, "Comment cannot be empty"),
});

export const upvoteSchema = z.object({
  usn: z.string().min(1),
});

export const createPollSchema = z.object({
  usn: z.string().min(1),
  userName: z.string().min(1),
  question: z.string().min(1, "Question is required"),
  options: z.array(z.string().min(1)).min(2, "At least 2 options are required"),
});

export const votePollSchema = z.object({
  usn: z.string().min(1),
  optionIndex: z.number().int().nonnegative(),
});

// Export types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;


export type BookMachineInput = z.infer<typeof bookMachineSchema>;

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;
export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateDiscussionInput = z.infer<typeof createDiscussionSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CreatePollInput = z.infer<typeof createPollSchema>;
