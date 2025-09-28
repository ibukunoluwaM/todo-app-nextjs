import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "./components/sessionProviders";
export const metadata: Metadata = {
  title: "Todo App",
  description: "An online todo app",
  icons: {
    icon: "/to-do-list.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Providers is a client component */}
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
