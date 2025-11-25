import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/validations";
import { authConfig } from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        usn: { label: "USN", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, unknown>) {
        try {
          // Validate credentials
          const validatedFields = loginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            return null;
          }

          const { usn, password } = validatedFields.data;

          // Check for admin credentials from environment
          if (usn.toUpperCase() === process.env.ADMIN_ID && password === process.env.ADMIN_PASSWORD) {
            return {
              id: "admin",
              usn: process.env.ADMIN_ID!,
              name: "Admin",
              mobile: "0000000000",
              role: "admin",
            };
          }

          // Connect to database (Lazy load for Edge compatibility)
          const { default: connectDB } = await import("@/lib/db");
          await connectDB();

          // Find user (Lazy load model)
          const { default: UserModel } = await import("@/models/User");
          const user = await UserModel.findOne({ usn: usn.toUpperCase() });

          if (!user) {
            return null;
          }

          // Verify password
          const isPasswordValid = await user.comparePassword(password);

          if (!isPasswordValid) {
            return null;
          }

          // Return user object
          return {
            id: String(user._id),
            usn: user.usn,
            name: user.name,
            mobile: user.mobile,
            role: user.role || "student",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
});

