'use client';

import { Search, Mic } from 'lucide-react';
import Link from 'next/link';

export function SearchBar() {
  return (
    <div className="px-6 pb-4 bg-background z-40 sticky top-[88px]">
      <Link href="/search" className="flex items-center gap-3 bg-gray-50 border-none rounded-2xl px-4 py-3 h-14 w-full shadow-sm">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm text-gray-400 truncate">Search &apos;organic milk&apos;</span>
        </div>
        <div className="w-8 h-8 flex items-center justify-center shrink-0">
          <Mic className="w-4 h-4 text-gray-400" />
        </div>
      </Link>
    </div>
  );
}
