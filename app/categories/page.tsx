'use client';

import { categories } from '@/lib/data';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-xl text-gray-900">Categories</h1>
        <Link href="/search" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <Search className="w-5 h-5 text-gray-600" />
        </Link>
      </header>

      <main className="flex-1 p-6">
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categories?id=${cat.id}`} className="flex flex-col items-center gap-3 group bg-white rounded-3xl p-4 shadow-soft border border-gray-50 active:scale-95 transition-transform">
              <div className={`w-16 h-16 rounded-full ${cat.color} flex items-center justify-center text-3xl shadow-inner`}>
                {cat.image}
              </div>
              <span className="text-xs font-semibold text-gray-800 text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
