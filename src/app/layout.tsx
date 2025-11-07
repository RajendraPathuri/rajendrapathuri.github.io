import type {Metadata} from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'x0vrpp',
  description: 'A simple portfolio and blog for GitHub users.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Fira+Code:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-background text-foreground")}>
        <div className="relative flex min-h-dvh flex-col">
          <Header />
          <main className="flex-1 container py-10">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
