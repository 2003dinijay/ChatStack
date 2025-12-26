import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import Nav from "@/components/ui/nav";

export const metadata: Metadata = {
  title: "ChatStack"
};

export default function RootLayout({ children }: { children: React.ReactNode}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

