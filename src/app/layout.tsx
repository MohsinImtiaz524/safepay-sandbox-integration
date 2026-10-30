import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Safepay Sandbox Lab",
  description: "A secure test environment for Safepay hosted checkout payments.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
