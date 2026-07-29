'use client';

import { useParams, useRouter } from 'next/navigation';
import { getProductById } from '@/lib/data';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import { ChevronLeft, Share2, Heart, Plus, Minus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const product = getProductById(productId);
  
  const { items, addItem, removeItem, updateQuantity } = useCartStore();
  const cartItem = items.find((item) => item.id === productId);
  const quantity = cartItem?.quantity || 0;

  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) {
    return <div className="p-8 text-center">Product not found</div>;
  }

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 max-w-[480px] mx-auto z-40 bg-background/90 backdrop-blur-md px-6 py-4 flex items-center justify-between transition-all">
        <button onClick={() => router.back()} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center active:bg-gray-100 bg-white shadow-sm border border-gray-100">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full flex items-center justify-center active:bg-gray-100 bg-white shadow-sm border border-gray-100">
            <Share2 className="w-5 h-5 text-gray-900" />
          </button>
          <button onClick={() => setIsFavorite(!isFavorite)} className="w-10 h-10 rounded-full flex items-center justify-center active:bg-gray-100 bg-white shadow-sm border border-gray-100">
            <Heart className={`w-5 h-5 ${isFavorite ? 'text-primary fill-primary' : 'text-gray-900'}`} />
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Product Image */}
        <div className="relative w-full aspect-square bg-gray-50 pt-16 flex items-center justify-center">
          <Image src={product.image} alt={product.name} fill className="object-cover mix-blend-multiply p-8 pt-16" priority />
        </div>

        {/* Product Info */}
        <div className="px-4 py-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-md mb-2">10 MINS DELIVERY</span>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              <span className="text-sm text-gray-500 font-medium mt-1 block">{product.weight}</span>
            </div>
          </div>

          <div className="flex items-end gap-2 mt-4 mb-6">
            <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
            {discount > 0 && (
              <>
                <span className="text-sm text-gray-400 line-through mb-1">₹{product.mrp}</span>
                <span className="text-xs font-bold text-primary bg-primary-50 px-2 py-1 rounded-md mb-1">{discount}% OFF</span>
              </>
            )}
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 flex gap-4 items-start border border-gray-100">
            <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Product Details</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-gray-100 p-4 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40">
        <AnimatePresence mode="wait">
          {quantity === 0 ? (
            <motion.button
              key="add-btn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => addItem(product)}
              className="bg-primary text-white font-bold py-4 px-8 rounded-2xl w-full shadow-premium active:scale-[0.98] transition-transform text-lg"
            >
              Add to Cart
            </motion.button>
          ) : (
            <motion.div
              key="quantity-selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-primary text-white rounded-2xl flex items-center justify-between p-2 shadow-premium h-[60px]"
            >
              <button onClick={() => quantity === 1 ? removeItem(product.id) : updateQuantity(product.id, quantity - 1)} className="w-12 h-full flex items-center justify-center active:bg-primary-600 rounded-xl transition-colors">
                {quantity === 1 ? <Trash2 className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
              </button>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold w-12 text-center">{quantity}</span>
                <span className="text-[10px] font-medium opacity-80 uppercase">In Cart</span>
              </div>
              <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-12 h-full flex items-center justify-center active:bg-primary-600 rounded-xl transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Ensure Trash2 is imported since we used it
import { Trash2 } from 'lucide-react';
