import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ContentProvider } from "./contexts/content-context";
import { ViewTransitions } from "next-view-transitions";
import dynamic from 'next/dynamic';
import { SkeletonSidebar } from "./components/skeleton-sidebar";

const Sidebar = dynamic(() => import('./components/sidebar').then((mod) => mod.Sidebar), {
  ssr: false,
loading: () => <SkeletonSidebar />
});

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
          <div className="flex h-screen bg-background text-foreground">
            <ContentProvider>
              <Sidebar />
              <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </ContentProvider>
          </div>
        </body>
      </html>
    </ViewTransitions>
  );
}
