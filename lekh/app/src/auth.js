// https://medium.com/@garciadiazjaime/nextauth-js-an-easy-way-to-add-authentication-to-your-next-js-project-65e6f3603087
// https://nextjs.org/learn/dashboard-app/adding-authentication

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

let secret = process.env.AUTH_SECRET
  || (process.env.NODE_ENV === "development" ? "lekh" : undefined);

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret,
  session: {
    strategy: "jwt"
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
        if (credentials.email === "admin@local"
        && credentials.password === "admin") {
          return {
            id: "1",
            name: "Admin",
            email: "admin@local"
          }
        }

        return null;
      }
    })
  ]
});

