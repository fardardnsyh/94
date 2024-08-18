"use client";
import React from "react";
import Header from "../(dashboard)/header";
import { SignIn } from "@clerk/clerk-react";
import SideNav from "./_components/SideNav";
import { Toaster } from "@/components/ui/sonner";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <div className="md:w-64 fixed ">
        <SideNav />
      </div>
      <main className="md:ml-72">{children}</main>
      <Toaster />
    </div>
  );
}

export default DashboardLayout;
