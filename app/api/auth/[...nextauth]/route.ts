import NextAuth from "next-auth";
import authconfig from "../../../lib/authConfig";

// signup and signin with google
const handler = NextAuth(authconfig);

export { handler as GET, handler as POST };
