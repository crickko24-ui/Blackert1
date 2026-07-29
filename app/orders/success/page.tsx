'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export default function OrderSuccessPage() {
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrderId(`#QK-${Math.floor(Math.random() * 1000000)}`);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-primary pb-safe">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        >
          <CheckCircle2 className="w-24 h-24 text-white mb-6" strokeWidth={1.5} />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-2"
        >
          Order Placed!
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/80 font-medium max-w-[250px] mb-10"
        >
          Your groceries will arrive in 10 minutes.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/20 backdrop-blur-md rounded-2xl p-6 w-full max-w-sm mb-10 border border-white/30 shadow-lg"
        >
          <div className="flex flex-col gap-4 text-left">
            <div>
              <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Order ID</span>
              <p className="font-bold text-lg">{orderId}</p>
            </div>
            <div>
              <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Estimated Delivery</span>
              <p className="font-bold text-lg">10:30 AM Today</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full"
        >
          <Link href="/" className="bg-white text-primary font-bold py-4 px-8 rounded-2xl w-full shadow-lg active:scale-[0.98] transition-transform block">
            Back to Home
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
