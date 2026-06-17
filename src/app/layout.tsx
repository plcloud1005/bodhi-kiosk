import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bodhi Meditation San Francisco",
  description: "Front Desk Touchscreen Guide System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#F5F0E8", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}