"use client";
import { SignInButton, UserButton } from "@clerk/nextjs";
import React, { ReactNode } from "react";
import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import Header from "./header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-svh min-w-full bg-background max-h-screen">
      <Header />
      <main className="flex w-full flex-grow">{children}</main>
      <Toaster />
    </div>
  );
}
