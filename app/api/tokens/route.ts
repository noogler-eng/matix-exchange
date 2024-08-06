import { NextRequest, NextResponse } from "next/server";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

export async function GET(req: NextRequest){
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get('address') || "";
    
    const connection = new Connection("https://api.devnet.solana.com");
    let txhash = await connection.requestAirdrop((searchQuery), 1e9);
    let balance = await connection.getBalance(searchQuery);
    const noOfSol = balance / LAMPORTS_PER_SOL;

    NextResponse.json({
        balance: noOfSol * 80,
    })
}