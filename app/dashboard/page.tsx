'use client'
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import prisma from "../db"

export default function Dashboard(){
    
    const session = useSession();
    const [data, setData] = useState({
        balance: 0,
        publicKey: ""
    });

    const fetchData = async()=>{
        try{
            const user = await prisma.user.findFirst({
                where: {
                    username: session.data?.user?.email || ""
                },
                select: {
                    inrWallet: {
                        select: {
                            balance: true
                        }
                    },
                    solWallet: {
                        select: {
                            publicKey: true
                        }
                    }
                }
            })

            console.log(user);
            setData({
                balance: user?.inrWallet?.balance || 0,
                publicKey: user?.solWallet?.publicKey || ""
            });

            console.log(user);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchData();
    }, [])

    return <div className="flex items-center justify-center h-full">
        <div className="flex p-12 border rounded-xl w-3/6">
            <h2 className="text-3xl font-semibold">Welcome, 😊 <span className="text-blue-400">{session.data?.user?.name}!</span></h2>
            <p>Balance: ${data.balance}</p>
            <p>wallet address: {data.publicKey}</p>
        </div>
    </div>
}