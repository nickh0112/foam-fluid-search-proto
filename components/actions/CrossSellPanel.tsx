'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Sparkles } from 'lucide-react';
import { SearchResult, CrossSellBrand } from '@/lib/types';
import { MatchBadge } from '../results/MatchBadge';

interface CrossSellPanelProps {
  result: SearchResult | null;
  isOpen: boolean;
  onClose: () => void;
  onBrandClick?: (brand: CrossSellBrand) => void;
}

export function CrossSellPanel({ result, isOpen, onClose, onBrandClick }: CrossSellPanelProps) {
  if (!result) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-labelledby="crosssell-title"
            aria-modal="true"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-[#E5E5E0] z-50 overflow-hidden shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#E5E5E0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 id="crosssell-title" className="text-base font-semibold text-[#1A1A1A]">
                    Cross-Sell Discovery
                  </h2>
                  <p className="text-sm text-[#6B6B6B]">
                    @{result.creator.handle}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close panel"
                className="p-2 text-[#9CA3AF] hover:text-[#6B6B6B] hover:bg-[#F5F5F0] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto h-[calc(100%-73px)]">
              <p className="text-sm text-[#6B6B6B] mb-4">
                Brands @{result.creator.handle} has featured organically:
              </p>

              <div className="space-y-2">
                {result.crossSellBrands?.map((brand, index) => (
                  <motion.button
                    key={brand.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onBrandClick?.(brand)}
                    className="w-full flex items-center justify-between p-4 bg-[#F5F5F0] border border-[#E5E5E0] rounded-xl hover:border-[#D1D5DB] hover:shadow-sm transition-all group"
                  >
                    <div className="flex-1 text-left">
                      <h3 className="text-sm font-medium text-[#1A1A1A] group-hover:text-indigo-600 transition-colors">
                        {brand.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#6B6B6B]">
                          {brand.videoCount} video{brand.videoCount !== 1 ? 's' : ''}
                        </span>
                        <span className="text-[#D1D5DB]">•</span>
                        <div className="flex gap-1">
                          {brand.matchTypes.map((type) => (
                            <MatchBadge
                              key={type}
                              type={type}
                              showLabel={false}
                              size="sm"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-indigo-600 transition-colors" />
                  </motion.button>
                ))}
              </div>

              {/* Insight */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A] mb-1">
                      Partnership Opportunity
                    </p>
                    <p className="text-xs text-[#6B6B6B]">
                      @{result.creator.handle} has authentic content with {result.crossSellBrands?.length} brands
                      in complementary categories. Consider bundled partnerships or
                      category expansion opportunities.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
