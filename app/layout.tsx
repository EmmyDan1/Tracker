import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Tracker — Logistics Management",
  description:
    "Manage agents, deliveries, and tracking for your logistics company.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#0D1F14",
              border: "1px solid #2A2A2A",
              color: "#ffffff",
              fontSize: "16px",
            },
          }}
        />
      </body>
    </html>
  );
}
