import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getTimeRemaining(endTime: Date | string): {
  total: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const end = typeof endTime === "string" ? new Date(endTime) : endTime;
  const total = end.getTime() - new Date().getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

  return {
    total,
    hours,
    minutes,
    seconds,
  };
}

export function formatUSN(usn: string): string {
  return usn.toUpperCase().trim();
}

export const MOBILE_REGEX = /^\d{10}$/;
export function isValidMobile(mobile: string): boolean {
  return MOBILE_REGEX.test(mobile);
}

export const USN_REGEX = /^[A-Za-z0-9]+$/;
export function isValidUSN(usn: string): boolean {
  return USN_REGEX.test(usn) && usn.length <= 16;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800 border-red-200";
    case "important":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "general":
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
    case "delivered":
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "in-use":
    case "preparing":
    case "in-progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "faulty":
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "available":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case "electrical":
      return "Zap";
    case "plumbing":
      return "Droplet";
    case "carpentry":
      return "Wrench";
    case "room":
      return "Home";
    case "bathroom":
      return "Bath";
    default:
      return "AlertCircle";
  }
}
