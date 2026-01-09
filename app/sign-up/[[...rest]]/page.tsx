"use client";

import { SignIn } from "@clerk/nextjs";
import FooterSection from "@/components/FooterSection";

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-neutral-primary">

      {/* Centered Sign-in */}
      <div className="flex-1 flex items-center justify-center py-16">
        <SignIn routing="path" path="/sign-in" />
      </div>

      {/* Footer */}
      <FooterSection />

    </div>
  );
}