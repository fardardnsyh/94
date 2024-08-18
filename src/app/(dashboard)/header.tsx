"use client";
import Logo from "@/components/Logo";
import { SignInButton, UserButton } from "@clerk/nextjs";
import React, { ReactNode } from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import ShimmerButton from "@/components/magicui/shimmer-button";
function Header() {
  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <div>
      <nav className="flex justify-between h-[60px] px-4 py-2 w-full  rounded-lg border-b bg-background shadow-xl">
        <Logo />

        <div className="flex gap-4 items-center justify-end">
          <ThemeSwitcher />
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <Link href={"/dashboard"}>
                <div className="z-10 flex min-h-[16rem] items-center justify-center">
                  <Button className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white">
                    Dashboard
                  </Button>
                  <span className="whitespace-pre-wrap text-center font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 "></span>
                </div>
              </Link>
              <UserButton />
            </div>
          ) : (
            <SignInButton>
              <Button className="text-white bg-gradient-to-r from-indigo-400 to-cyan-400">
                Get started
              </Button>
            </SignInButton>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
