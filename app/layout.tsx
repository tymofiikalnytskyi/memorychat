import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MemoryChat — AI Assistant",
  description: "An AI chatbot with persistent conversation memory",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}