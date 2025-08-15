import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        // Static fallback credentials for admin
        if (
          credentials.email === "admin" &&
          credentials.password === "pawiro"
        ) {
          return {
            id: "static-admin",
            email: "admin",
            name: "Admin",
            role: "ADMIN",
          } as any;
        }

        // Static fallback credentials for instructor
        if (
          credentials.email === "instructor" &&
          credentials.password === "pawiro"
        ) {
          return {
            id: "static-instructor",
            email: "instructor",
            name: "Instructor",
            role: "INSTRUCTOR",
          } as any;
        }

        // Database user lookup
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const ok = await compare(credentials.password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "ADMIN",
        } as any;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: { strategy: "jwt" as const },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-local",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
