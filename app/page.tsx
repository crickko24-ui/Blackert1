import { LocationHeader } from '@/components/home/LocationHeader';
import { SearchBar } from '@/components/home/SearchBar';
import { categories, getProductsByCategory } from '@/lib/data';
import { ProductCard } from '@/components/ui/ProductCard';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Home() {
  const freshFruits = getProductsByCategory('fruits');
  const dailyEssentials = [...getProductsByCategory('milk'), ...getProductsByCategory('bread')];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LocationHeader />
      <SearchBar />

      <main className="flex-1 flex flex-col gap-6 pt-2 pb-6">
        {/* Hero Banner */}
        <section className="px-6">
          <div className="h-36 bg-gradient-to-br from-[#FF4FA3] to-[#FF85C1] rounded-[28px] p-6 text-white relative overflow-hidden flex flex-col justify-center shadow-[0_16px_32px_rgba(255,79,163,0.15)]">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <h3 className="text-2xl font-bold leading-tight z-10">Fresh Fruits<br/>Up to 40% Off</h3>
            <p className="text-xs mt-2 font-medium opacity-90 z-10">Direct from organic farms</p>
          </div>
        </section>

        {/* Categories */}
        <section className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Explore by Category</h2>
            <Link href="/categories" className="text-[10px] font-bold text-[#FF4FA3] uppercase tracking-wider">
              See All
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {categories.slice(0, 8).map((cat) => (
              <Link key={cat.id} href={`/categories?id=${cat.id}`} className="flex flex-col items-center gap-2 text-center group">
                <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center text-2xl group-active:scale-95 transition-transform`}>
                  {cat.image}
                </div>
                <span className="text-[10px] font-bold text-gray-600">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section: Fresh Fruits */}
        <section className="px-6 py-6 bg-[#FFF0F7] rounded-[32px] mx-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Fresh from Farm</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {freshFruits.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Section: Daily Essentials */}
        <section className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Daily Essentials</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {dailyEssentials.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
