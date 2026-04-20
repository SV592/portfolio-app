"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

interface InsightsModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  layoutId?: string;
  children: React.ReactNode;
}

const InsightsModal: React.FC<InsightsModalProps> = ({
  open,
  onClose,
  title,
  subtitle,
  layoutId,
  children,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            aria-label="Close"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            layoutId={layoutId}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="colors relative z-10 w-full max-w-[960px] max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl"
            transition={{ type: "spring", stiffness: 340, damping: 32, mass: 0.75 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ delay: 0.18, duration: 0.22, ease: "easeOut" }}
            >
              <div className="flex items-start justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{title}</h2>
                  {subtitle && (
                    <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
                  )}
                </div>
                <button
                  aria-label="Close insights"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100/20 flex-shrink-0"
                >
                  ×
                </button>
              </div>
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default InsightsModal;
