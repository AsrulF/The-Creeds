// app/testing/page.js
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";


const HomePage = () => {
 const router = useRouter();


 const handleClick = () => {
   router.push("/about");
 };


 return (
   <div>
     <h1>Welcome to Next.js App</h1>
     <Link href="/about">About</Link>
     <button onClick={handleClick}>Go to About</button>
   </div>
 );
};


export default HomePage;