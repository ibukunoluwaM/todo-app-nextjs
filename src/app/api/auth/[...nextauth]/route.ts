import NextAuth  from "next-auth";
import  { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { prisma } from "../../../../../lib/prisma";


export const authOptions: NextAuthOptions = {
  providers: [
    // Google login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Email + Password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // runs whens oemone tries to sign in with email and password to authorize user
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email or password cannot be empty!");
        }

        // Looks for existing user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("This email does not exist in the record! Please check and try again."); //user doesnt exit.
        }
        // password confirmation
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password!
        );
        if (!isValid) {
          throw new Error("Wrong password! Please check and try again.");
        } //password wrong.
        return user;
      },
    }),
  ],
  pages: {
    signOut: "/login", // replace the default confirm page
  },
  session: {
    strategy: "jwt", // sessions stored in a JWT
    maxAge: 24 * 60 * 60
  },

    jwt: {
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; 
        token.name = user.name;
      }// attach the DB user ID to JWT
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
        session.user.name = token.name ;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
