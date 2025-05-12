import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import { useRouter } from "next/router";

export default async function Page(){
  const session = await getServerSession(authOptions);
  const router = useRouter();
  if (session?.user){
    router.push("/Main");
  }else{
    router.push("/api/auth/signin")
  }
}