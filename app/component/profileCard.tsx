'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { WalletMinimal } from 'lucide-react';
import { Copy } from 'lucide-react';
import { CopyCheck } from 'lucide-react';
import { useState } from "react";


export default function ProfileCard({
  publicKey,
  balance,
}: {
  publicKey: string;
  balance: number;
}) {
  const session = useSession();
  const navigate = useRouter();
  const [address, setAddress] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  if (session.status == "unauthenticated") {
    navigate.replace("/");
    return null;
  }

  // adding skeleton
  if (session.status == "loading") {
    return <div>loading...</div>;
  }

  return (
    <div className="flex p-12 border rounded-xl w-3/6 flex-col gap-3">
      <div className="flex gap-3 items-center border-b-1">
        <img
          src={session.data?.user?.image || ""}
          width={70}
          height={70}
          alt=""
          className="rounded-full border p-1 shadow-lg shadow-indigo-500/50"
        />
        <h2 className="text-3xl font-semibold">
          Welcome, 😊{" "}
          <span className="text-blue-400">{session.data?.user?.name}!</span>
        </h2>
      </div>
      <p className="text-sm text-gray-400 flex items-center gap-2"><span><WalletMinimal size={14}/></span>matix account assets</p>
      <div className="flex justify-between items-center">
        <p className="text-5xl font-semibold">${(balance.toPrecision(3))} <span className="text-3xl text-gray-400">USD</span></p>
        <p className="text-sm text-gray-400">public key: {publicKey.slice(0,4)}...{publicKey.slice(-4)}</p>
      </div>
      <button onClick={()=>{
        setAddress(publicKey);
        navigator.clipboard.writeText(publicKey);
        setIsCopied(true);
      }} className="flex gap-2 items-center py-2 px-8 text-sm rounded-lg text-white flex gap-2 items-center mt-8 bg-blue-500 font-semibold w-5/12">{isCopied ? <span><CopyCheck/></span>: <span><Copy/></span>}your wallet address</button>
    </div>
  );
}
