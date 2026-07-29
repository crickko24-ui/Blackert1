'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Search, Mic, Clock, ArrowUpRight } from 'lucide-react';
import { getProducts } from '@/lib/data';
import { ProductCard } from '@/components/ui/ProductCard';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  
  const allProducts = getProducts();
  const filteredProducts = query 
    ? allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))
    : [];

  const recentSearches = ['Milk', 'Bread', 'Eggs', 'Potato'];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md px-6 py-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center active:bg-gray-100 shrink-0">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-gray-50 border-none rounded-2xl px-4 py-3 h-14">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search &apos;organic milk&apos;" 
            className="bg-transparent border-none outline-none text-sm text-gray-900 w-full placeholder:text-gray-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="w-8 h-8 flex items-center justify-center shrink-0 text-gray-400">
          <Mic className="w-4 h-4" />
        </button>
      </header>

      <main className="flex-1 p-6">
        {!query ? (
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3 px-1 uppercase tracking-wider">Recent Searches</h2>
            <div className="flex flex-col gap-2">
              {recentSearches.map((term, idx) => (
                <button key={idx} onClick={() => setQuery(term)} className="flex items-center gap-3 p-3 active:bg-gray-50 rounded-xl transition-colors">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 text-left text-sm font-medium text-gray-700">{term}</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="w-12 h-12 text-gray-200 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                <p className="text-sm text-gray-500">Try searching for something else.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
