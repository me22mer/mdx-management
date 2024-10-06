import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ViewTransitions } from "next-view-transitions";
import { Providers } from "./components/providers";
import { MainLayout } from "./components/main-layout";
import { AuthWrapper } from "./components/authwrapper";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MDX Manager",
  description: "Manage and edit your MDX content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        >
          <Providers>
            <AuthWrapper>
              <MainLayout>{children}</MainLayout>
            </AuthWrapper>
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  );
}