import { NextRequest, NextResponse } from "next/server";
import { getSupportedTokens } from "./supported_token";
import { getAccount, getAssociatedTokenAddress, getMint } from "@solana/spl-token"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");

export async function GET(req: NextRequest, res: NextResponse){
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address') || "";
    // ata => associated token account
    // pda => program derived address
    
    console.log(address);
    // getting all the token balance in inr either USDT, USDC, SOL
    try{
        const supported_token = await getSupportedTokens();
        let balance = 0;
        const balances = await Promise.all(supported_token.map(token => getAccountBalance(token, address)));
        balances.forEach(b => balance+=b );

        return Response.json({
            msg: balance
        })
    }catch(error){
        // console.log(error);
        return Response.json({
            msg: error
        }, {status: 500})
    }
}

async function getAccountBalance(token: {
    name: string,
    mint: string,
    native: boolean,
    price: string
}, address: string) {

    console.log(token);
    try {
        if (token.native) {
            const balance = await connection.getBalance(new PublicKey(address));
            const balanceInSOL = Number(balance) / LAMPORTS_PER_SOL;
            const balanceInValue = balanceInSOL * Number(token.price);
            console.log('Balance (SOL):', balanceInSOL);
            console.log('Balance (Value):', balanceInValue);
            return balanceInValue;
        } else {
            const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), new PublicKey(address));
            console.log('Associated Token Address (ATA):', ata);

            const account = await getAccount(connection, ata);
            if (!account) return 0;

            const mint = await getMint(connection, new PublicKey(token.mint));
            const tokenAmount = Number(account.amount) / (10 ** mint.decimals);
            const balanceInValue = tokenAmount * Number(token.price);
            console.log('Balance (Token):', tokenAmount);
            console.log('Balance (Value):', balanceInValue);

            return balanceInValue;
        }
    } catch (error) {
        console.error('Error fetching account balance:', error);
        return 0; 
    }
}



