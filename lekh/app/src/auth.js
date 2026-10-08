// https://medium.com/@garciadiazjaime/nextauth-js-an-easy-way-to-add-authentication-to-your-next-js-project-65e6f3603087
// https://nextjs.org/learn/dashboard-app/adding-authentication
// https://authjs.dev/reference/core

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { z } from "zod";

import { getUsersByEmailQuery } from "@/query/user-query.js";

let secret = process.env.AUTH_SECRET
  || (process.env.NODE_ENV === "development" ? "lekh" : undefined);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret,
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role_id = user.role_id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = Number(token.id);
        session.user.role_id = token.role_id;
      }

      return session;
    }
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "E-mail",
          type: "email"
        },
        password: {
          label: "Password",
          type: "password"
        }
      },
      async authorize(credentials) {
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(4)
        }).safeParse(credentials);

        if(!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const rows = await getUsersByEmailQuery(email);
        const user = rows[0];

        if (!user) {
          return null;
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role_id: user.role_id
        };
      }
    })
  ]
});

