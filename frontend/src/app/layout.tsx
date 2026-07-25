import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LayoutProvider } from "@/context/LayoutContext";
import { ReactQueryProvider } from "@/components/providers/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tatvam - Learn the Essence",
  description:
    "An AI-first personalized learning platform focused on understanding, not memorization.",
  icons: {
    icon: "/logos/tatvam-logo.png",
    shortcut: "/logos/tatvam-logo.png",
    apple: "/logos/tatvam-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <TooltipProvider delayDuration={150}>
            <ReactQueryProvider>
              <LayoutProvider>
                <AuthProvider>{children}</AuthProvider>
              </LayoutProvider>
            </ReactQueryProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
