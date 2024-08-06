import GoogleProvider from "next-auth/providers/google";
import prisma from "@/app/db";
import * as solanaWeb3 from "@solana/web3.js";
import { Session } from "next-auth"; 

export interface new_session extends Session {
  user: {
    email: string;
    name: string;
    image: string;
    uid: string
  }
}

const authconfig = {
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
    
    // frontend, or server part received after signin
    async session({ session, token }: any) {
      const newSession: new_session = session as new_session;
      if(newSession.user && token.uid) {
        newSession.user.uid = token.uid ?? "";
      }
      return newSession!;
    },
    
    // chck while signin
    async jwt({ token, account }: any) {
      const user = await prisma.user.findFirst({
        where: {
            sub: account?.providerAccountId
        }
      })

      if (user) token.uid = user.id;
      return token;
    },
    
    async signIn({ user, account, profile, email, credentials }: any) {
      if (account?.provider == "google") {
        const email: string = user.email || "";

        if (!email) return false;

        const userExists = await prisma.user.findFirst({
          // i did't mention username unique that's why it is showing err or
          // so used findFirst
          where: {
            username: email,
          },
        });

        if (userExists) return true;

        // generating keypair on solana devnet blockchain
        // ED25519 is used for hashing
        // private key -> uin8array means 0 to 255 number will be there (64 byte array)
        const keyPair = await solanaWeb3.Keypair.generate();

        await prisma.user.create({
          data: {
            name: user.name,
            username: email,
            sub: account.providerAccountId,
            provider: "google",
            solWallet: {
              create: {
                publicKey: keyPair.publicKey.toBase58(),
                privateKey: keyPair.secretKey.toString(),
              },
            },
            inrWallet: {
              create: {
                balance: 0,
              },
            },
          },
        });
        return true;
      }
      return false;
    },
  },
};

export default authconfig;