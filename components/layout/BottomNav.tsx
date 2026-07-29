'use client';

import { Home, Grid, Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { useCartStore } from '@/store/useCartStore';

export function BottomNav() {
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categories', href: '/categories', icon: Grid },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Cart', href: '/cart', icon: ShoppingCart, badge: totalItems },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-4 left-6 right-6 z-50 max-w-md mx-auto pb-safe">
      <nav className="flex justify-around items-center h-16 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)] rounded-[24px] px-2 border border-gray-100">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'relative flex flex-col items-center justify-center w-16 h-full transition-colors',
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <div className="relative">
                <item.icon
                  className={clsx('w-6 h-6 transition-transform duration-300', isActive && 'scale-110')}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={clsx('text-[9px] uppercase font-bold mt-1 transition-all', isActive ? 'opacity-100 text-primary' : 'opacity-70 text-gray-400')}>
                {item.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-[1px] w-8 h-[2px] bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
