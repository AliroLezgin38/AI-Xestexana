import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/firebase-admin";
import bcrypt from "bcryptjs";

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

        // Firebase-dən yoxlayırıq
        const usersRef = db.collection("users");
        const snapshot = await usersRef.where("email", "==", credentials.email).get();

        if (snapshot.empty) {
          // Geriye uyğunluq (mock userlər db-də yoxdursa test üçün)
          const mockUsers = [
            { id: "1", name: "Admin",        email: "admin@test.com",     password: "123", role: "ADMIN" },
            { id: "2", name: "Dr. House",    email: "doctor@test.com",    password: "123", role: "DOCTOR" },
            { id: "3", name: "John Doe",     email: "patient@test.com",   password: "123", role: "PATIENT" },
            { id: "4", name: "Receptionist", email: "reception@test.com", password: "123", role: "RECEPTION" },
          ];
          const mock = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
          if (mock) return mock;
          
          return null;
        }

        const userDoc = snapshot.docs[0];
        const user = userDoc.data();

        // Parolu yoxlayırıq
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: userDoc.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id   = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id   = token.id;
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "klinika-super-secret-key-2024",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
