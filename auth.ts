import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/validations";
import { authConfig } from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        usn: { label: "USN", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, unknown>) {
        try {
          const validatedFields = loginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            return null;
          }

          const { usn, password } = validatedFields.data;

          if (
            usn.toUpperCase() === process.env.ADMIN_ID &&
            password === process.env.ADMIN_PASSWORD
          ) {
            return {
              id: "admin",
              usn: process.env.ADMIN_ID!,
              name: "Admin",
              mobile: "0000000000",
              role: "admin",
            };
          }

          const { default: connectDB } = await import("@/lib/db");
          await connectDB();

          const { default: UserModel } = await import("@/models/User");
          const user = await UserModel.findOne({ usn: usn.toUpperCase() });

          if (!user) {
            return null;
          }

          const isPasswordValid = await user.comparePassword(password);

          if (!isPasswordValid) {
            return null;
          }

          const safeUser = {
            id: String(user._id),
            usn: user.usn,
            name: user.name,
            mobile: user.mobile || "",
            role: user.role || "student",
          };

          return safeUser;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
});
