import { NextRequest, NextResponse } from "next/server";
// import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { supported_token } from "./supported_token";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token"
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com")

export async function GET(req: NextRequest){
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address') || "";
    // ata => associated token account
    // pda => program derived address
    
    const balance = await Promise.all(supported_token.map((token)=>{
        return getAccountBalance(token, address);
    }))


}


async function getAccountBalance(token: {
    name: string,
    mint: string
}, address: string){

    const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), new PublicKey(address));
    console.log('ata: ', ata);
    const account = await getAccount(connection, ata);

    

}