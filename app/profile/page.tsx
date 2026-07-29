'use client';

import { UserCircle, MapPin, Package, Heart, Bell, ShieldQuestion, ChevronRight, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const menuItems = [
    { icon: Package, label: 'My Orders', href: '/orders' },
    { icon: MapPin, label: 'Saved Addresses', href: '/addresses' },
    { icon: Heart, label: 'Favorites', href: '/favorites' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: ShieldQuestion, label: 'Support & FAQs', href: '/support' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-6 pt-12 pb-8 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FF4FA3] to-[#FF9ECD] mb-4 shadow-sm">
        </div>
        <h1 className="font-bold text-2xl text-gray-900 mb-1">Rohan Sharma</h1>
        <p className="text-sm font-medium text-gray-500">+91 98765 43210</p>
      </header>

      <main className="flex-1 px-6 pb-24 flex flex-col gap-4">
        <div className="bg-white rounded-[32px] p-2 shadow-sm border border-gray-100">
          {menuItems.map((item, i) => (
            <Link key={i} href={item.href} className="flex items-center justify-between p-4 active:bg-gray-50 rounded-2xl transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-gray-600" />
                </div>
                <span className="font-semibold text-gray-800 text-sm">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </Link>
          ))}
        </div>

        <button className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 flex items-center justify-center gap-2 text-red-500 font-bold active:bg-red-50 transition-colors mt-4">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </main>
    </div>
  );
}
