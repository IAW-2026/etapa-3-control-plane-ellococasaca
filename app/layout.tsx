import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ClerkProvider, Show, SignOutButton, UserButton } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Control Plane | El Loco Casaca",
  description: "Panel de superadmin del ecosistema El Loco Casaca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={process.env.BUYER_APP_URL}>
      <html lang="es">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex h-screen overflow-hidden bg-slate-50">
            <Show when="signed-in">
              <Sidebar />
            </Show>
            <main className="flex-1 overflow-y-auto">
              <Show when="signed-in">
                <div className="flex justify-end gap-3 border-b border-slate-200 bg-white px-8 py-3">
                  <UserButton />
                  <SignOutButton>
                    <button className="text-sm text-slate-600 hover:text-slate-900">
                      Cerrar sesión
                    </button>
                  </SignOutButton>
                </div>
              </Show>
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
