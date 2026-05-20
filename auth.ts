import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { getAdminDb } from "@/lib/firebase-admin";
import bcrypt from "bcryptjs";
import { isDemoMode, MOCK_USER_SESSION } from "@/lib/demo";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || "LynkSell_Development_Secret_1234567890",
  // We don't use the true firebase adapter globally because we use credentials,
  // but if we do, we need the session strategy to be jwt or keep it for OAuth.
  // NextAuth v5 suggests keeping session strategy to jwt when mixing credentials and oauth.
  session: { strategy: "jwt" },
  adapter: FirestoreAdapter(getAdminDb()),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (isDemoMode()) {
          return MOCK_USER_SESSION.user as any;
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password wajib diisi');
        }

        const db = getAdminDb();
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', credentials.email).limit(1).get();

        if (snapshot.empty) {
          throw new Error('Email atau password salah');
        }

        const userDoc = snapshot.docs[0];
        const user = userDoc.data();

        if (!user.passwordHash) {
          throw new Error('Akun ini menggunakan login Google. Silakan gunakan Google Sign-In.');
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash);

        if (!isValid) {
          throw new Error('Email atau password salah');
        }

        return {
          id: user.id || userDoc.id,
          name: user.name,
          email: user.email,
          image: user.image || null,
          brandSlug: user.brandSlug || null,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.brandSlug = (user as any).brandSlug;
      }
      if (trigger === "update" && session?.brandSlug) {
        token.brandSlug = session.brandSlug;
      }
      return token;
    },
    async session({ session, token }) {
      if (isDemoMode()) {
        return MOCK_USER_SESSION as any;
      }
      if (token && session.user) {
        session.user.id = token.id as string;
        (session as any).brandSlug = token.brandSlug;
      }
      return session;
    }
  }
});
