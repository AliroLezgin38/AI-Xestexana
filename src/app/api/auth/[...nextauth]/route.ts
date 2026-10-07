import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Test istifadəçiləri (real DB hazır olanda prisma ilə əvəzlənəcək)
        const mockUsers = [
          { id: "1", name: "Admin",        email: "admin@test.com",     password: "123", role: "ADMIN" },
          { id: "2", name: "Dr. House",    email: "doctor@test.com",    password: "123", role: "DOCTOR" },
          { id: "3", name: "John Doe",     email: "patient@test.com",   password: "123", role: "PATIENT" },
          { id: "4", name: "Receptionist", email: "reception@test.com", password: "123", role: "RECEPTION" },
        ];

        const user = mockUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { id: string; name: string; email: string; role: string }).role;
        token.id   = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as { role?: string; id?: string }).role = token.role as string;
        (session.user as { role?: string; id?: string }).id   = token.id  as string;
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "klinika-super-secret-key-2024",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
