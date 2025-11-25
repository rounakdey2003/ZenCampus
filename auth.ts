import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/validations";
import { authConfig } from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  trustHost: true, // Required for Netlify and other serverless platforms
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        usn: { label: "USN", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, unknown>) {
        try {
          console.log("🔐 Auth attempt started");

          // Validate credentials
          const validatedFields = loginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            console.log("❌ Validation failed:", validatedFields.error);
            return null;
          }

          const { usn, password } = validatedFields.data;
          console.log("✅ Credentials validated for USN:", usn);

          // Check for admin credentials from environment
          if (
            usn.toUpperCase() === process.env.ADMIN_ID &&
            password === process.env.ADMIN_PASSWORD
          ) {
            console.log("👨‍💼 Admin login successful");
            return {
              id: "admin",
              usn: process.env.ADMIN_ID!,
              name: "Admin",
              mobile: "0000000000",
              role: "admin",
            };
          }

          // Connect to database (Lazy load for Edge compatibility)
          console.log("🔌 Connecting to database...");
          const { default: connectDB } = await import("@/lib/db");
          await connectDB();
          console.log("✅ Database connected");

          // Find user (Lazy load model)
          const { default: UserModel } = await import("@/models/User");
          const user = await UserModel.findOne({ usn: usn.toUpperCase() });

          if (!user) {
            console.log("❌ User not found for USN:", usn);
            return null;
          }

          console.log("✅ User found:", user.usn);

          // Verify password
          const isPasswordValid = await user.comparePassword(password);

          if (!isPasswordValid) {
            console.log("❌ Invalid password for USN:", usn);
            return null;
          }

          console.log("✅ Password valid, returning user object");

          // Return user object
          const safeUser = {
            id: String(user._id),
            usn: user.usn,
            name: user.name,
            mobile: user.mobile || "",
            role: user.role || "student",
          };

          console.log(
            "✅ Returning safe user object:",
            JSON.stringify(safeUser)
          );
          return safeUser;
        } catch (error) {
          console.error("💥 Auth error:", error);
          return null;
        }
      },
    }),
  ],
});
