import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { CommandPalette } from "@/components/layout/command-palette";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "LabVault — Laboratory Equipment Lifecycle & Maintenance Platform",
  description:
    "Enterprise-grade laboratory asset management, custody tracking, maintenance workflows, and ISO-17025 calibration scheduling for higher education and research institutions.",
  keywords: [
    "Lab Equipment Management",
    "Chain of Custody",
    "Maintenance Workflow",
    "Calibration Scheduling",
    "Next.js App Router",
    "Radix UI",
    "Zustand",
    "Zod",
  ],
  authors: [{ name: "LabVault Engineering Team" }],
  openGraph: {
    title: "LabVault — Laboratory Equipment Lifecycle & Maintenance",
    description: "Asset tracking, maintenance queues, and chain of custody platform for academic research labs.",
    type: "website",
    siteName: "LabVault",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased flex flex-col bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <AppHeader />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                {children}
              </main>
            </div>
          </div>
          <CommandPalette />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
