import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '../lib/utils';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className={cn(
            "fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl min-w-[300px]",
            type === 'success' ? "bg-teal-50/90 border-teal-100 text-teal-800" :
            type === 'error' ? "bg-red-50/90 border-red-100 text-red-800" :
            "bg-blue-50/90 border-blue-100 text-blue-800"
          )}
        >
          {type === 'success' && <CheckCircle2 className="text-teal-600" size={20} />}
          {type === 'error' && <AlertCircle className="text-red-600" size={20} />}
          <p className="text-sm font-bold flex-1">{message}</p>
          <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
