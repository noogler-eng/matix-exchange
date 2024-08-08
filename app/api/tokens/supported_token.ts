import axios from "axios";

let LAST_UPDATE: number;
let TOKEN_REFRESHAL_TIME: number
let prices: {
    [key: string]: any
}

export let supported_token = [
    {
        name: "USDC",
        mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        native: false,
        price: 0
    },{
        name: "USDT",
        mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        native: false,
        price: 0
    },{
        name: "SOL",
        mint: "So11111111111111111111111111111111111111112",
        native: true,
        price: 0
    }
]

export async function getSupportedTokens(){
    if(!LAST_UPDATE || new Date().getTime() - LAST_UPDATE < TOKEN_REFRESHAL_TIME){
        const res = await axios.get("https://price.jup.ag/v6/price?ids=SOL,USDC,USDT");
        prices = res.data.data;
        LAST_UPDATE = new Date().getTime();
    }
    
    // updating supoorted token array with their prices init
    const supportedToken = supported_token.map((s: any)=>{
        return {
            ...s,
            price: prices[s.name]["price"]
        }
    })

    return supportedToken;
}



// api's call
// {
//     data: {
//         SOL: {
//             id: "So11111111111111111111111111111111111111112",
//             mintSymbol: "SOL",
//             vsToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
//             vsTokenSymbol: "USDC",
//             price: 151.298459111
//         },
//         USDC: {
//             id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
//             mintSymbol: "USDC",
//             vsToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
//             vsTokenSymbol: "USDC",
//             price: 1
//         },
//         USDT: {
//             id: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
//             mintSymbol: "USDT",
//             vsToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
//             vsTokenSymbol: "USDC",
//             price: 0.999777
//         }
//     },
//     timeTaken: 0.00047570999959134497
//     }