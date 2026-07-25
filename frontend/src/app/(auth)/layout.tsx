import { ReactNode } from "react";
import { GuestGuard } from "../../components/providers/GuestGuard";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <GuestGuard>
      <div className="min-h-screen w-full flex bg-background text-foreground">
        {children}
      </div>
    </GuestGuard>
  );
}
