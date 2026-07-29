'use client';

import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, Trash2, ChevronRight, Receipt } from 'lucide-react';
import { LocationHeader } from '@/components/home/LocationHeader';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, getSavings } = useCartStore();

  const subtotal = getTotal();
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const platformFee = 5;
  const taxes = Math.round(subtotal * 0.05); // 5% mock tax
  const finalTotal = subtotal + deliveryFee + platformFee + taxes;
  const savings = getSavings();

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md px-6 py-4 flex items-center justify-center">
          <h1 className="font-bold text-lg text-gray-900">Your Cart</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-32 h-32 bg-primary-50 rounded-full flex items-center justify-center mb-6">
            <span className="text-5xl">🛒</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-[250px]">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link href="/" className="bg-primary text-white font-bold py-4 px-8 rounded-2xl w-full shadow-md active:scale-[0.98] transition-transform">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md px-6 py-4 flex flex-col gap-2">
        <h1 className="font-bold text-lg text-gray-900">Your Cart ({items.length} items)</h1>
        <div className="flex items-center text-xs font-semibold text-green-600 bg-green-50 w-fit px-2 py-1 rounded-md">
          Delivery in 10 minutes
        </div>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-4">
        {/* Cart Items */}
        <div className="bg-white rounded-3xl p-4 shadow-soft">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative">
                  <Image src={item.image} alt={item.name} fill className="object-cover mix-blend-multiply p-1" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                  <span className="text-xs text-gray-500 block mb-1">{item.weight}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gray-900">₹{item.price}</span>
                    {item.mrp > item.price && (
                      <span className="text-[10px] text-gray-400 line-through">₹{item.mrp}</span>
                    )}
                  </div>
                </div>

                <div className="bg-primary-50 rounded-xl flex items-center shadow-inner shrink-0 h-9">
                  <button onClick={() => item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)} className="w-8 h-full flex items-center justify-center text-primary active:bg-primary-100 rounded-l-xl transition-colors">
                    {item.quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  </button>
                  <span className="text-sm font-bold text-primary w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-full flex items-center justify-center text-primary active:bg-primary-100 rounded-r-xl transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bill Details */}
        <div className="bg-white rounded-3xl p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
            <Receipt className="w-5 h-5 text-gray-400" />
            <h2>Bill Details</h2>
          </div>
          
          <div className="flex flex-col gap-3 text-sm text-gray-600 mb-4">
            <div className="flex justify-between">
              <span>Item Total</span>
              <span className="font-semibold text-gray-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-semibold text-gray-900">{deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span className="font-semibold text-gray-900">₹{platformFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span className="font-semibold text-gray-900">₹{taxes}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">To Pay</span>
              <span className="font-bold text-xl text-gray-900">₹{finalTotal}</span>
            </div>
          </div>
          
          {savings > 0 && (
            <div className="bg-green-50 rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm text-green-700 font-medium">Your total savings</span>
              <span className="text-sm font-bold text-green-700">₹{savings}</span>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Checkout Bar */}
      <div className="fixed bottom-16 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-gray-100 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40">
        <Link href="/checkout" className="bg-primary w-full rounded-2xl flex items-center justify-between p-4 shadow-premium active:scale-[0.98] transition-transform">
          <div className="flex flex-col text-white">
            <span className="font-bold text-lg leading-none">₹{finalTotal}</span>
            <span className="text-[10px] font-medium opacity-90 uppercase tracking-wider mt-1">Total</span>
          </div>
          <div className="flex items-center text-white font-bold gap-1">
            Checkout <ChevronRight className="w-5 h-5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
