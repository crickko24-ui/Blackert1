import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { BottomNav } from '@/components/layout/BottomNav';

const font = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Quicksy | Premium Q-Commerce',
  description: 'Premium Q-Commerce Grocery Delivery App',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Quicksy',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${font.variable} font-sans`}>
      <body className="antialiased bg-[#FFFDFE] text-[#1A1A1A] pb-[env(safe-area-inset-bottom)]" suppressHydrationWarning>
        <div className="mx-auto min-h-screen bg-background relative shadow-sm max-w-[480px] md:max-w-none md:flex md:justify-center">
          <main className="w-full max-w-[480px] min-h-screen bg-background relative pb-20 overflow-x-hidden md:border-x md:border-gray-100 md:shadow-premium">
            {children}
            <BottomNav />
          </main>
        </div>
      </body>
    </html>
  );
}
