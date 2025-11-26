import { Types } from "mongoose";

export interface User {
  _id: Types.ObjectId | string;
  usn: string;
  name: string;
  mobile: string;
  password: string;
  email?: string;
  room?: string;
  role?: "student" | "admin";
  dateOfBirth?: Date;
  bloodGroup?: string;
  course?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  createdAt: Date;
}



export type MachineStatus = "Available" | "In Use" | "Faulty" | "Repairing";

export interface Machine {
  _id: Types.ObjectId | string;
  machineNumber: number;
  status: MachineStatus;
  userUSN: string | null;
  userName: string | null;
  startTime: Date | null;
  endTime: Date | null;
  repairEndTime: Date | null;
  lastUpdated: Date;
}

export type ComplaintCategory = "electrical" | "plumbing" | "carpentry" | "room" | "bathroom";
export type ComplaintStatus = "pending" | "completed";

export interface Complaint {
  _id: Types.ObjectId | string;
  category: ComplaintCategory;
  userUSN: string;
  userName: string;
  description: string;
  location: string;
  photo: string | null;
  status: ComplaintStatus;
  createdAt: Date;
  completedAt: Date | null;
}

export type NoticeCategory = "General" | "Academic" | "Event" | "Urgent" | "Maintenance";
export type NoticePriority = "Low" | "Medium" | "High";
export type NoticeStatus = "Active" | "Archived";

export interface Notice {
  _id: Types.ObjectId | string;
  title: string;
  content: string;
  category: NoticeCategory;
  priority: NoticePriority;
  status: NoticeStatus;
  createdBy: string;
  expiresAt: Date;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export type FoodType = "veg" | "non-veg";
export type MealType = "breakfast" | "lunch" | "snacks" | "dinner";
export type OrderStatus = "pending" | "preparing" | "delivered" | "cancelled";

export interface MenuItem {
  _id: Types.ObjectId | string;
  name: string;
  description: string;
  price: number;
  type: FoodType;
  mealType: MealType;
  availableFrom: string;
  availableTo: string;
  available: boolean;
  createdAt: Date;
}

export interface CanteenOrder {
  _id: Types.ObjectId | string;
  userUSN: string;
  userName: string;
  itemId: Types.ObjectId | string;
  itemName: string;
  price: number;
  quantity: number;
  roomNumber: string;
  instructions: string;
  status: OrderStatus;
  createdAt: Date;
}

export type DiscussionType = "public" | "anonymous";
export type WardenComplaintStatus = "pending" | "in-progress" | "resolved";

export interface Comment {
  userUSN: string;
  userName: string;
  comment: string;
  createdAt: Date;
}

export interface Discussion {
  _id: Types.ObjectId | string;
  userUSN: string;
  userName: string;
  type: DiscussionType;
  title: string;
  content: string;
  upvotes: number;
  upvoters: string[];
  comments: Comment[];
  createdAt: Date;
}

export interface WardenComplaint {
  _id: Types.ObjectId | string;
  userUSN: string;
  userName: string;
  type: DiscussionType;
  title: string;
  content: string;
  upvotes: number;
  upvoters: string[];
  comments: Comment[];
  status: WardenComplaintStatus;
  createdAt: Date;
}

export interface PollOption {
  text: string;
  votes: number;
}

export interface Poll {
  _id: Types.ObjectId | string;
  userUSN: string;
  userName: string;
  question: string;
  options: PollOption[];
  voters: string[];
  createdAt: Date;
}

export interface DashboardStats {
  totalStudents: number;
  workDoneToday: number;
  dueWork: number;
}

export interface ApiResponse<T = any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
