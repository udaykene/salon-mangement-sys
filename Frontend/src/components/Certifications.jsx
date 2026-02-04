import React from "react";

const Certifications = () => {
  return (
    // {/* Trust Badges / Certifications */}
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-6 sm:py-8 overflow-hidden border-t border-white/5">
      <div className="max-w-6xl  mx-auto px-4">
        <p className="text-center text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 uppercase tracking-wider">
          Certified & Trusted By
        </p>
        <div className="flex flex-col w-full sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-12">
          {/* ISO Certified */}
          <div className="flex items-center gap-3 sm:gap-4 opacity-70 hover:opacity-100 transition-opacity">
            <div className="w-6 h-6 shrink-0 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-[10px] sm:text-xs">
                ✓
              </span>
            </div>
            <span className="text-white font-semibold text-xs sm:text-sm md:text-base tracking-wide">
              ISO Certified
            </span>
          </div>

          {/* Award Winning */}
          <div className="flex items-center gap-3 sm:gap-4 opacity-70 hover:opacity-100 transition-opacity">
            <div className="w-6 h-6 shrink-0 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-[10px] sm:text-xs">
                ★
              </span>
            </div>
            <span className="text-white font-semibold text-xs sm:text-sm md:text-base tracking-wide">
              Award Winning
            </span>
          </div>

          {/* Expert Certified */}
          <div className="flex items-center gap-3 sm:gap-4 opacity-70 hover:opacity-100 transition-opacity">
            <div className="w-6 h-6 shrink-0 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-[10px] sm:text-xs">
                ♥
              </span>
            </div>
            <span className="text-white font-semibold text-xs sm:text-sm md:text-base tracking-wide">
              Expert Certified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certifications;
