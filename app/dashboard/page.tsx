import prisma from "../db";
import authconfig from "../lib/authConfig";
import ProfileCard from "../component/profileCard";
import { getServerSession } from "next-auth";
import axios from "axios";

const fetchData = async () => {
  const session = await getServerSession(authconfig);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(session?.user.uid),
      },
      select: {
        name: true,
        inrWallet: {
          select: {
            balance: true,
          },
        },
        solWallet: {
          select: {
            publicKey: true,
          },
        },
      },
    });

    return { user };
  } catch (error) {
    console.log(error);
  }
};


export default async function Dashboard() {
  const user = await fetchData();
  let balance;

  try{
    balance = await axios.get(`http://localhost:3000/api/tokens?address=GJka613DnHoTgf6P6p2hPvonSQ7U87ktVZtJedaF4BaA`)
  }catch(error){
    console.log(error);
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        User data could not be loaded.
      </div>
    );
  }


  return (
    <div className="flex items-center justify-center h-full">
      <ProfileCard
        publicKey={user.user?.solWallet?.publicKey || ""}
        balance={Number(balance?.data.msg) || 0}
      />
    </div>
  );
}
