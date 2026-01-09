"use client";

import { useRouter } from "next/navigation";
import AuthButtons from "@/components/AuthButtons";
import Categories from "@/components/Categories";

export default function Header() {
  const router = useRouter();
  return (
    <header className="w-full bg-blue border-b-2 border-border-dark">
      <div className="flex items-center justify-between px-4 py-6 relative">
        
        <div className="flex items-center gap-2">
          <Categories />
        </div>

        <button
          className="absolute left-1/2 transform -translate-x-1/2 text-4xl text-white"
          onClick={() => router.push(`/`)}
        >The Time Capsule</button>
        
        <div className="flex items-center gap-2">
          <AuthButtons />
        </div>

      </div>
    </header>
  );
}