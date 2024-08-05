import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/app/db";
import * as solanaWeb3 from "@solana/web3.js";

// signup and signin with google
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  // use when we have to build our own pages
  //   pages: {
  //     signIn: '/auth/signin',
  //     signOut: '/auth/signout',
  //     error: '/auth/error', 
  //     verifyRequest: '/auth/verify-request',
  //     newUser: '/auth/new-user'
  //   }
  callbacks: {
    async signIn({ user, account, profile, email, credentials }){
      if(account?.provider == 'google'){
        const username: string = user.email || "";

        if(!username) return false;

        const userExists = await prisma.user.findFirst({
          // i did't mention username unique that's why it is showing err or
          // so used findFirst
          where: {
            username: username
          }
        })

        if(userExists) return true;

        // generating keypair on solana devnet blockchain
        // ED25519 is used for hashing
        // private key -> uin8array means 0 to 255 number will be there (64 byte array)
        const keyPair = await solanaWeb3.Keypair.generate();

        await prisma.user.create({
          data: {
            name: user.name,
            username: username,
            provider: 'google',
            solWallet: {
              create: {
                publicKey: keyPair.publicKey.toBase58(),
                privateKey: keyPair.secretKey.toString()
              } 
            },
            inrWallet: {
              create: {
                balance: 0
              }
            }
          }
        })

        return true;
      }  
      return false;
    }
  }
});

export { handler as GET, handler as POST };
