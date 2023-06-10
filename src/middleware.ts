import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log('token', req.nextauth.token)
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        
        if(!token) return false;

        // if(token.role === "super-administrator") return true;

        return true;
      },
    },
    pages: {
      signIn: '/auth/login',
      signOut: '/admin/logout',
      error: '/admin/error'
    }
  }
)

export const config = { matcher: ["/admin/:path*"] }