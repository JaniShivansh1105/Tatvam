"use client";

import React from "react";
import { useAuthStore } from "@/store/auth-store";
import { UserAvatar } from "@/components/ui/UserAvatar";
import Link from "next/link";

export function UserMenu() {
  const user = useAuthStore((state) => state.user);

  return (
    <Link 
      href="/dashboard/profile"
      className="flex items-center gap-3 p-1 rounded-full hover:bg-[#F8F9FF] transition-all group cursor-pointer"
      title="View Profile"
    >
      <UserAvatar 
        name={user?.fullName} 
        email={user?.email} 
        userId={user?.id} 
        size="md"
        className="group-hover:scale-105 transition-transform"
      />
    </Link>
  );
}
