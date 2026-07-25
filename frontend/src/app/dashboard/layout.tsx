"use client";

import * as React from "react";
import { AuthGuard } from "@/components/providers/AuthGuard";
import { AppLayout } from "@/components/layout/AppLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppLayout>
        {children}
      </AppLayout>
    </AuthGuard>
  );
}
