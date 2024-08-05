'use client'
import { signIn, useSession } from "next-auth/react"
import { ShieldEllipsis } from 'lucide-react';
import { useRouter } from "next/navigation";
import { LayoutDashboard } from 'lucide-react';



export default function Hero(){

    const { data: session, status } = useSession()
    const navigate = useRouter();

    return <div>
        <div className="flex flex-col items-center gap-3 mt-8">
            <h1 className="text-5xl font-extrabold text-gray-400">The crypto of tomorrow, <span className="text-blue-400">today</span></h1>
            <p className="text-2xl font-semibold">Create a frictionless wallet with just a Google Account.</p>
            <p className="text-xl font-semibold text-gray-400">convert your INR into any CRYPTO currency</p>
            <button onClick={()=>signIn('google')} className="py-2 px-8 text-sm rounded-lg text-white flex gap-2 items-center mt-8 bg-blue-500 font-semibold"><span><ShieldEllipsis/></span>signin with google</button>
            { status == 'authenticated' ? <button className="py-2 px-8 text-sm rounded-lg text-white flex gap-2 items-center mt-8 bg-blue-500 font-semibold" onClick={()=>{
                navigate.replace('/dashboard');
            }}><span><LayoutDashboard/></span>/go to dashboard</button> : null }
        </div>
    </div>
}