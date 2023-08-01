"use client";
import { token } from "@/lib/authToken";
import SideBar from "./SideBar";
import { redirect } from "next/navigation";

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!token) redirect("/login");
  return (
    <>
      <SideBar />
      {children}
    </>
  );
}
