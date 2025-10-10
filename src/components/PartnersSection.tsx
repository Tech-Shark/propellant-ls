/**
 * Partners Logo Section
 * Animated scrolling section showcasing partner logos
 */

import { useEffect, useState } from 'react';

interface Partner {
  name: string;
  logo: string;
}

// Add your partner logos here
const PARTNERS: Partner[] = [
  { name: 'Partner 1', logo: '/placeholder.svg' },
  { name: 'Partner 2', logo: '/placeholder.svg' },
  { name: 'Partner 3', logo: '/placeholder.svg' },
  { name: 'Partner 4', logo: '/placeholder.svg' },
  { name: 'Partner 5', logo: '/placeholder.svg' },
  { name: 'Partner 6', logo: '/placeholder.svg' },
];

export function PartnersSection() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-16 px-4 bg-slate-900/30 overflow-hidden">
      <div className="container mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
          Trusted By Leading Organizations
        </h2>
        <p className="text-slate-400 text-center">
          Join our network of innovative partners
        </p>
      </div>

      {/* Scrolling container */}
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900/30 to-transparent z-10 pointer-events-none" />

        {/* Scrolling logos */}
        <div
          className="flex gap-12 animate-scroll-left"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {/* First set of logos */}
          {PARTNERS.map((partner, index) => (
            <div
              key={`partner-1-${index}`}
              className="flex-shrink-0 w-40 h-20 bg-slate-800/50 rounded-lg border border-slate-700 flex items-center justify-center hover:bg-slate-800 hover:border-slate-600 transition-all duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-[120px] max-h-[60px] object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-slate-400 text-sm font-medium">${partner.name}</span>`;
                  }
                }}
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {PARTNERS.map((partner, index) => (
            <div
              key={`partner-2-${index}`}
              className="flex-shrink-0 w-40 h-20 bg-slate-800/50 rounded-lg border border-slate-700 flex items-center justify-center hover:bg-slate-800 hover:border-slate-600 transition-all duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-[120px] max-h-[60px] object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-slate-400 text-sm font-medium">${partner.name}</span>`;
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
