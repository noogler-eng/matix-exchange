'use client'
import { useSession, signIn, signOut } from "next-auth/react" 
import Image from "next/image"

export default function Appbar(){

    // useSession only work in client component
    const { data: session, status } = useSession()

    return <div className="flex justify-between items-center px-4 py-3">
        <div className="text-3xl text-extrabold">
            MATIX
        </div>
        <div className="flex gap-3 items-center">
            { status == "authenticated" ? <div className="flex gap-2 items-center rounded-lg bg-gray-200 py-1 px-3">
                <img src={session.user?.image || ""} width={40} height={40} className="rounded-full" alt='user'/>
                <div className="text-sm">
                    <p>{session.user?.name}</p>
                    <p>{session.user?.email}</p>
                </div>    
            </div> : null }
            { status == "authenticated" ? <button onClick={() => signOut()} className="py-1 px-2 text-sm border-2 border-black rounded-full">logout</button>: <button onClick={()=>signIn('google')} className="py-1 px-4 text-sm border-2 border-black rounded-full hover:text-white hover:bg-black">login</button> }
        </div>
    </div>
}