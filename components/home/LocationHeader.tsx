'use client';

import { MapPin, ChevronDown, UserCircle } from 'lucide-react';
import { useLocationStore } from '@/store/useLocationStore';
import Link from 'next/link';

export function LocationHeader() {
  const address = useLocationStore((state) => state.address);

  return (
    <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md px-6 pt-8 pb-4 flex items-center justify-between">
      <Link href="/location" className="flex items-center gap-2 flex-1 min-w-0 pr-4">
        <div className="p-2 bg-[#FF4FA3]/5 rounded-full shrink-0">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Deliver to</p>
          <div className="flex items-center gap-1">
            <span className="font-bold text-sm text-gray-900 truncate">{address}</span>
            <ChevronDown className="w-4 h-4 text-gray-600 shrink-0" />
          </div>
        </div>
      </Link>
      <Link href="/profile" className="shrink-0">
        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-tr from-[#FF4FA3] to-[#FF9ECD]"></div>
        </div>
      </Link>
    </div>
  );
}
