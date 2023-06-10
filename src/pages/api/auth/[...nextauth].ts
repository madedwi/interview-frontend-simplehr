
import axios, { requestCsrf } from "@/lib/axios";
import NextAuth, { Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {},
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
        const { username, password }  = credentials as {
          username: string;
          password: string;
        };

        try {
          await requestCsrf();
          const res = await axios.post('/login', {
            email: username,
            password
          });

          const user = await res.data;
          
          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null
  
            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        } catch (error) {
          console.log(error);
          
          return null
        }
      }
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, user }: { token: any;  user:any; }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (user) {
        token.role = ''
        token.id = user.id
      }
      return token
    },
    async session({session, token, user}: {session: any; token: any; user: any;}) {
      session.user.id = parseInt(token.id);
      return session;
    }
  },
  pages: {
    signin: '/auth/login',
    signOut: '/auth/logout',
  }
}

export default NextAuth(authOptions)