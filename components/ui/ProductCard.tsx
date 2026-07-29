'use client';

import { Product, useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, removeItem, updateQuantity } = useCartStore();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity === 1) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="block relative bg-white rounded-[24px] p-3 shadow-sm border border-gray-100 flex flex-col h-full active:scale-[0.98] transition-transform">
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-50 flex items-center justify-center">
        <Image src={product.image} alt={product.name} fill className="object-cover mix-blend-multiply p-2" sizes="(max-width: 768px) 50vw, 33vw" />
      </div>
      
      <div className="flex flex-col flex-1">
        {discount > 0 && (
          <span className="text-[10px] font-bold text-[#FF4FA3] mb-1">SAVE ₹{product.mrp - product.price}</span>
        )}
        <h3 className="text-xs font-bold text-gray-900 leading-tight mb-1 line-clamp-2 min-h-[32px]">{product.name}</h3>
        <span className="text-[10px] text-gray-400 mb-2 line-clamp-1">{product.weight}</span>
        
        <div className="mt-auto flex items-center justify-between gap-1">
          <p className="text-sm font-bold tracking-tight text-gray-900">₹{product.price}</p>

          <div className="h-8 relative z-10 w-[72px]">
            <AnimatePresence mode="wait">
              {quantity === 0 ? (
                <motion.button
                  key="add-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  onClick={handleAdd}
                  className="w-full h-full bg-white border border-[#FF4FA3] text-[#FF4FA3] font-bold text-[10px] rounded-lg uppercase tracking-wide hover:bg-[#FF4FA3] hover:text-white transition-all flex items-center justify-center"
                >
                  Add
                </motion.button>
              ) : (
                <motion.div
                  key="quantity-selector"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="w-full h-full bg-[#FF4FA3] text-white rounded-lg flex items-center justify-between px-1 shadow-sm"
                >
                  <button onClick={handleDecrement} className="w-6 h-6 flex items-center justify-center active:bg-primary-600 rounded-md transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                  <button onClick={handleIncrement} className="w-6 h-6 flex items-center justify-center active:bg-primary-600 rounded-md transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Link>
  );
}
