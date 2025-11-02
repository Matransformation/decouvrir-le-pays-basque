"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "@/lib/toastStore";
import { useEffect } from "react";

export default function Toast() {
  const { message, type, clearToast } = useToastStore();

  // Disparition automatique après 2,5 secondes
  useEffect(() => {
    if (message) {
      const timer = setTimeout(clearToast, 2500);
      return () => clearTimeout(timer);
    }
  }, [message, clearToast]);

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999]">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
              type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
