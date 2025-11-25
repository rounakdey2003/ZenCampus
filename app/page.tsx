import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  // If user is authenticated, redirect to appropriate dashboard
  if (session?.user) {
    if (session.user.role === "admin") {
      redirect("/admin");
    }
    redirect("/dashboard");
  }

  // If not authenticated, redirect to login
  redirect("/login");
}
