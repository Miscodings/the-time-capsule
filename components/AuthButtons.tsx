"use client";

import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function AuthButtons() {
  const router = useRouter();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => router.push("/cart")}
        className="win95-button"
      >
        Cart
      </button>

      <SignedIn>
        <SignOutButton>
          <button className="win95-button">Sign Out</button>
        </SignOutButton>
      </SignedIn>

      <SignedOut>
        <SignInButton>
          <button className="win95-button">Sign In</button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
