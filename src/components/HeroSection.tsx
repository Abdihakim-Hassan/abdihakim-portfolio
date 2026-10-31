import React, { useState, useEffect } from 'react';
import {
  Github,
  Linkedin,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { WhatsAppIcon } from './WhatsAppIcon';

interface HeroSectionProps {
  lang: Language;
  onExploreProjects: () => void;
  onOpenContact: () => void;
  onOpenCV: () => void;
}

/**
 * Removes the uniform studio-gray background around the outer border of the portrait
 * via a fast edge-connected flood fill so the oversized outlined wordmark sits
 * directly behind Abdihakim's head and shoulders in both Dark and Light mode.
 */
let cachedCutout: string | null = null;

function useStudioCutout(src: string): string {
  const [cutoutUrl, setCutoutUrl] = useState<string>(() => {
    if (cachedCutout) return cachedCutout;
    try {
      const stored = sessionStorage.getItem('abdihakim_cutout_cache_v2');
      if (stored) {
        cachedCutout = stored;
        return stored;
      }
    } catch {
      // ignore
    }
    return '';
  });

  useEffect(() => {
    if (cachedCutout && cutoutUrl === cachedCutout) return;
    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) return;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        const visited = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        let head = 0;
        let tail = 0;

        const isStudioBackdrop = (idx: number): boolean => {
          const x = idx % w;
          const y = (idx / w) | 0;
          // Protect deep interior eye sockets and interior white shirt collar (inside neck/lapels)
          if (y > h * 0.30 && y < h * 0.38 && x > w * 0.38 && x < w * 0.62) return false;
          if (y > h * 0.55 && x > w * 0.344 && x < w * 0.62) return false;

          const p = idx * 4;
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];
          // Studio backdrop (including the bright radial halo around the head and neck corners) is cool/neutral gray:
          // low saturation (max - min <= 28) and non-warm hue (r - b <= 12), whereas skin has r - b > 20.
          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          const saturationDiff = maxC - minC;
          const warmth = r - b;
          return r >= 82 && saturationDiff <= 28 && warmth <= 12;
        };

        const pushIfBg = (x: number, y: number) => {
          const idx = y * w + x;
          if (!visited[idx] && isStudioBackdrop(idx)) {
            visited[idx] = 1;
            queue[tail++] = idx;
          }
        };

        // Seed from top, left, and right borders
        for (let x = 0; x < w; x++) {
          pushIfBg(x, 0);
        }
        for (let y = 0; y < h; y++) {
          pushIfBg(0, y);
          pushIfBg(w - 1, y);
        }

        while (head < tail) {
          const curr = queue[head++];
          const cx = curr % w;
          const cy = (curr / w) | 0;

          if (cx > 0) pushIfBg(cx - 1, cy);
          if (cx + 1 < w) pushIfBg(cx + 1, cy);
          if (cy > 0) pushIfBg(cx, cy - 1);
          if (cy + 1 < h) pushIfBg(cx, cy + 1);
        }

        // Also clear isolated gray studio pockets trapped between outer hair curls
        const maxHairY = Math.floor(h * 0.38);
        for (let y = 0; y < maxHairY; y++) {
          for (let x = 0; x < w; x++) {
            if (y > h * 0.17 && x > w * 0.34 && x < w * 0.66) continue;
            const idx = y * w + x;
            if (!visited[idx]) {
              const p = idx * 4;
              const r = data[p];
              const g = data[p + 1];
              const b = data[p + 2];
              const sat = Math.max(r, g, b) - Math.min(r, g, b);
              const warmth = r - b;
              if (r >= 118 && sat <= 24 && warmth <= 10) {
                visited[idx] = 1;
              }
            }
          }
        }

        // Apply transparency with smooth alpha matting & edge color decontamination
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = y * w + x;
            if (visited[idx]) {
              data[idx * 4 + 3] = 0;
            } else if (x > 1 && x + 2 < w && y > 1 && y + 2 < h) {
              let bgCount3 = 0;
              let bgCount5 = 0;
              for (let dy = -2; dy <= 2; dy++) {
                const ny = y + dy;
                for (let dx = -2; dx <= 2; dx++) {
                  const nx = x + dx;
                  if (visited[ny * w + nx]) {
                    bgCount5++;
                    if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) bgCount3++;
                  }
                }
              }

              if (bgCount5 > 0) {
                const p = idx * 4;
                const r = data[p];
                const g = data[p + 1];
                const b = data[p + 2];
                const warmth = r - b;

                // Hair/suit edge pixel with gray background spill
                if (warmth <= 14) {
                  if (r > 52) {
                    const fgOpacity = Math.max(0, Math.min(1, (185 - r) / 133));
                    data[p + 3] = Math.round(fgOpacity * 255);
                    // Decontaminate gray halo spill on hair curls and suit edges
                    data[p] = Math.round(r * 0.22);
                    data[p + 1] = Math.round(g * 0.22);
                    data[p + 2] = Math.round(b * 0.25);
                  } else if (bgCount3 >= 3) {
                    data[p + 3] = Math.round(255 * (1 - bgCount3 * 0.08));
                  }
                } else if (bgCount3 > 0) {
                  // Warm skin/ear edge: smooth anti-aliased feathering
                  data[p + 3] = Math.round(255 * (1 - bgCount3 * 0.09));
                }
              }
            }
          }
        }

        // Complete both shoulders, deltoid caps, and upper sleeves on a widened canvas (600x500)
        // so neither shoulder is clipped vertically by the original 500x500 crop border.
        const outW = Math.round(w * 1.2);
        const outH = h;
        const srcCenterX = w * 0.486; // 243px (exact collar & tie symmetry axis)
        const outCenterX = outW * 0.5; // 300px
        const offsetX = Math.round(outCenterX - srcCenterX); // 57px

        const cleanDistR = new Float64Array(h);
        const cleanDistL = new Float64Array(h);
        const scanStartY = Math.floor(h * 0.55); // 275px
        const centerCol = Math.round(srcCenterX);

        for (let y = scanStartY; y < h; y++) {
          let rE = centerCol;
          for (let x = w - 1; x > centerCol; x--) {
            if (!visited[y * w + x]) {
              rE = x;
              break;
            }
          }
          let lE = centerCol;
          for (let x = 0; x < centerCol; x++) {
            if (!visited[y * w + x]) {
              lE = x;
              break;
            }
          }
          cleanDistR[y] = Math.max(0, rE - srcCenterX - 2.5);
          cleanDistL[y] = Math.max(0, srcCenterX - lE - 2.5);
        }

        const smoothR = new Float64Array(h);
        const smoothL = new Float64Array(h);
        for (let y = scanStartY; y < h; y++) {
          let sumR = 0;
          let sumL = 0;
          let cnt = 0;
          for (let dy = -4; dy <= 4; dy++) {
            const ny = Math.min(h - 1, Math.max(scanStartY, y + dy));
            sumR += cleanDistR[ny];
            sumL += cleanDistL[ny];
            cnt++;
          }
          smoothR[y] = sumR / cnt;
          smoothL[y] = sumL / cnt;
        }

        const outData = new Uint8ClampedArray(outW * outH * 4);
        const shoulderStartY = Math.floor(h * 0.59); // 295px
        const blendEndY = Math.floor(h * 0.646); // 323px

        // 1. Copy head, hair, face, ears, neck, and upper collar (y <= 323) 100% untouched
        for (let y = 0; y <= blendEndY; y++) {
          for (let sx = 0; sx < w; sx++) {
            const dx = sx + offsetX;
            if (dx >= 0 && dx < outW) {
              const sp = (y * w + sx) * 4;
              const dp = (y * outW + dx) * 4;
              outData[dp] = data[sp];
              outData[dp + 1] = data[sp + 1];
              outData[dp + 2] = data[sp + 2];
              outData[dp + 3] = data[sp + 3];
            }
          }
        }

        // 2. Render complete, symmetrical tailored shoulders, armhole seams, and rounded deltoid sleeves
        const deltoidStartY = Math.floor(h * 0.676); // 338px
        const sampleBilinear = (fx: number, y: number) => {
          const clampedX = Math.max(0, Math.min(w - 1, fx));
          const x0 = Math.floor(clampedX);
          const x1 = Math.min(w - 1, x0 + 1);
          const frac = clampedX - x0;
          const p0 = (y * w + x0) * 4;
          const p1 = (y * w + x1) * 4;
          return [
            data[p0] * (1 - frac) + data[p1] * frac,
            data[p0 + 1] * (1 - frac) + data[p1 + 1] * frac,
            data[p0 + 2] * (1 - frac) + data[p1 + 2] * frac,
          ];
        };

        for (let y = shoulderStartY; y < outH; y++) {
          const srcR = smoothR[y];
          const srcL = smoothL[y];
          if (srcR < 65) continue;

          const tBlend = Math.min(1, Math.max(0, (y - shoulderStartY) / (blendEndY - shoulderStartY)));
          const wBlend = tBlend * tBlend * (3 - 2 * tBlend);

          let symW = srcR;
          if (y >= deltoidStartY) {
            const dy = y - deltoidStartY;
            const baseDeltoid = smoothR[deltoidStartY];
            symW = baseDeltoid + 68 * (1 - Math.exp(-dy / 26)) + 0.075 * dy;
          }

          const targetR = (srcR + 2.0) * (1 - wBlend) + symW * wBlend;
          const targetL = (srcL + 2.0) * (1 - wBlend) + symW * wBlend;
          const innerCore = Math.min(w * 0.27, srcR * 0.72); // 135px core keeps shirt, tie & lapels 1:1

          for (let x = 0; x < outW; x++) {
            const dx = x - outCenterX;
            const absDx = Math.abs(dx);
            const targetW = dx >= 0 ? targetR : targetL;
            if (absDx > targetW + 2.5) continue;

            const alpha = Math.max(0, Math.min(1, (targetW + 1 - absDx) / 2.2));
            if (alpha <= 0 && y > blendEndY) continue;

            const clampedAbsDx = Math.min(absDx, targetW);
            let r = 0;
            let g = 0;
            let b = 0;

            if (dx >= 0) {
              let srcAbs = clampedAbsDx;
              if (clampedAbsDx > innerCore) {
                const u = (clampedAbsDx - innerCore) / Math.max(1, targetW - innerCore);
                const uMapped = Math.pow(u, 0.85);
                srcAbs = innerCore + uMapped * (srcR - innerCore);
              }
              const rgb = sampleBilinear(srcCenterX + srcAbs, y);
              r = rgb[0];
              g = rgb[1];
              b = rgb[2];
            } else {
              if (clampedAbsDx <= innerCore) {
                const rgb = sampleBilinear(srcCenterX - clampedAbsDx, y);
                r = rgb[0];
                g = rgb[1];
                b = rgb[2];
              } else {
                const u = (clampedAbsDx - innerCore) / Math.max(1, targetW - innerCore);
                const uMapped = Math.pow(u, 0.85);
                const srcAbsL = innerCore + uMapped * (srcL - innerCore);
                const srcAbsR = innerCore + uMapped * (srcR - innerCore);
                const rgbL = sampleBilinear(srcCenterX - srcAbsL, y);
                const rgbR = sampleBilinear(srcCenterX + srcAbsR, y);
                // Mirror only the outer shoulder seam & sleeve cap (srcAbsR > 188, outside the breast pocket)
                const m = Math.max(0, Math.min(1, (srcAbsR - 188) / 18)) * wBlend;
                r = rgbL[0] * (1 - m) + rgbR[0] * m;
                g = rgbL[1] * (1 - m) + rgbR[1] * m;
                b = rgbL[2] * (1 - m) + rgbR[2] * m;
              }
            }

            // Subtle 3D cylindrical darkening along the outer sleeve edge
            const edgeDist = targetW - clampedAbsDx;
            if (edgeDist < 16 && y > deltoidStartY) {
              const shade = 0.85 + 0.15 * (edgeDist / 16);
              r *= shade;
              g *= shade;
              b *= shade;
            }

            const dp = (y * outW + x) * 4;
            const newA = Math.round(alpha * 255);
            if (y <= blendEndY) {
              outData[dp] = Math.round(outData[dp] * (1 - wBlend) + r * wBlend);
              outData[dp + 1] = Math.round(outData[dp + 1] * (1 - wBlend) + g * wBlend);
              outData[dp + 2] = Math.round(outData[dp + 2] * (1 - wBlend) + b * wBlend);
              outData[dp + 3] = Math.round(outData[dp + 3] * (1 - wBlend) + newA * wBlend);
            } else {
              outData[dp] = Math.round(r);
              outData[dp + 1] = Math.round(g);
              outData[dp + 2] = Math.round(b);
              outData[dp + 3] = newA;
            }
          }
        }

        const outCanvas = document.createElement('canvas');
        outCanvas.width = outW;
        outCanvas.height = outH;
        const outCtx = outCanvas.getContext('2d');
        if (!outCtx) return;

        const finalImageData = new ImageData(outData, outW, outH);
        outCtx.putImageData(finalImageData, 0, 0);
        const resultDataUrl = outCanvas.toDataURL('image/png');
        cachedCutout = resultDataUrl;
        try {
          sessionStorage.setItem('abdihakim_cutout_cache_v2', resultDataUrl);
        } catch {
          // ignore storage quota error
        }
        if (isMounted) {
          setCutoutUrl(resultDataUrl);
        }
      } catch {
        if (isMounted && !cutoutUrl) {
          setCutoutUrl(src);
        }
      }
    };
    img.src = src;
    return () => {
      isMounted = false;
    };
  }, [src, cutoutUrl]);

  return cutoutUrl || cachedCutout || src;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onExploreProjects,
}) => {
  const { owner, setIsEmailModalOpen } = usePortfolioData();
  const t = translations[lang].hero;
  const portraitCutout = useStudioCutout(owner.portrait);

  return (
    <section
      id="home"
      className="relative min-h-[100svh] sm:min-h-screen w-full flex flex-col justify-between pt-20 sm:pt-24 overflow-hidden bg-[#f4f5f7] dark:bg-[#0c0d11] transition-colors duration-300 select-none"
    >
      {/* Top Status & Identity Strip */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-2 sm:pt-6 relative z-20 flex flex-col items-center text-center">
        <div className="hero-status-pill group relative overflow-hidden inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/85 dark:bg-white/[0.06] border border-emerald-500/25 dark:border-emerald-400/25 backdrop-blur-md text-[10px] sm:text-xs font-mono font-semibold tracking-wide text-zinc-800 dark:text-zinc-100 hover:scale-105 hover:border-emerald-500/50 transition-all duration-300">
          {/* Subtle Periodic Glass Shimmer Sweep */}
          <span
            aria-hidden="true"
            className="hero-status-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-400/20 dark:via-emerald-300/15 to-transparent"
          />

          {/* Live Radar Indicator Dot */}
          <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>

          <span className="relative z-10">{t.badge}</span>
        </div>
      </div>

      {/* Center Stage: Giant Outlined Typography Behind Centered Portrait (Matches Screenshot 1) */}
      <div className="relative flex-grow flex items-end justify-center w-full mt-2 sm:mt-4">
        {/* Giant Edge-to-Edge Continuous Infinite Outlined Wordmark Marquee */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10 overflow-hidden"
        >
          <div className="hero-marquee-track items-center">
            {[0, 1].map((groupIndex) => (
              <div key={groupIndex} className="flex items-center shrink-0">
                {[0, 1, 2, 3].map((itemIndex) => (
                  <span
                    key={itemIndex}
                    className="hero-outline-text font-extrabold uppercase tracking-[-0.03em] text-[24vw] sm:text-[18.5vw] lg:text-[16.5vw] leading-none whitespace-nowrap pr-[6vw] select-none"
                  >
                    {owner.shortBrand}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Centered Cutout Portrait of Abdihakim Hassan Mohamud */}
        <div className="relative z-20 w-full max-w-[360px] sm:max-w-[540px] lg:max-w-[630px] mx-auto flex justify-center items-end px-2 sm:px-4">
          <img
            src={portraitCutout}
            alt={owner.fullName}
            className={`w-full h-auto max-h-[50svh] sm:max-h-[70vh] object-contain object-bottom transition-opacity duration-300 ${portraitCutout ? 'opacity-100' : 'opacity-0'}`}
            fetchPriority="high"
          />
        </div>
      </div>

      {/* Bottom Clean Full-Width Identity & Actions Strip (Placed BELOW the portrait & marquee so it never covers the ABDIHAKIM text) */}
      <div className="relative z-30 w-full bg-white/90 dark:bg-[#111319]/92 border-t border-zinc-900/10 dark:border-white/[0.08] backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <p className="text-[11px] sm:text-sm font-sans font-bold uppercase tracking-[0.16em] sm:tracking-[0.22em] text-zinc-900 dark:text-zinc-100">
                {owner.fullName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              {/* GitHub — Official Dark Charcoal (#181717) */}
              <a
                href={owner.github}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#181717] text-white border border-white/15 shadow-sm hover:scale-105 hover:opacity-90 transition-all"
                aria-label="GitHub: Abdihakim-Hassan"
                title={`GitHub: ${owner.githubHandle}`}
              >
                <Github className="w-4 h-4" />
              </a>

              {/* LinkedIn — Official LinkedIn Blue (#0A66C2) */}
              <a
                href={owner.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#0A66C2] text-white border border-[#0A66C2] shadow-sm hover:scale-105 hover:opacity-90 transition-all"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              {/* WhatsApp — Official WhatsApp Green (#25D366) with Authentic Phone Bubble Logo */}
              <a
                href={owner.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#25D366] text-white border border-[#25D366] shadow-sm hover:scale-105 hover:opacity-90 transition-all"
                aria-label={`WhatsApp: ${owner.whatsapp}`}
                title={`WhatsApp: ${owner.whatsapp}`}
              >
                <WhatsAppIcon className="w-5 h-5" variant="two-tone" />
              </a>

              {/* Email / Gmail — Interactive Gmail Options Modal Trigger */}
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-[#1e2028] border border-zinc-200 dark:border-white/15 shadow-sm hover:scale-105 transition-all cursor-pointer"
                aria-label={`Email: ${owner.email}`}
                title="Send Email (Open in Gmail, Default Mail, or Copy Address)"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M2 6.5V18c0 1.1.9 2 2 2h2V9.8l6 4.5 6-4.5V20h2c1.1 0 2-.9 2-2V6.5c0-1.8-2.1-2.8-3.5-1.7L12 10 5.5 4.8C4.1 3.7 2 4.7 2 6.5z" fill="#EA4335" />
                  <path d="M2 6.5V18c0 1.1.9 2 2 2h2V9.8L2 6.8V6.5z" fill="#4285F4" />
                  <path d="M22 6.5V18c0 1.1-.9 2-2 2h-2V9.8l4-3V6.5z" fill="#34A853" />
                  <path d="M18 9.8V4.8c1.4-1.1 3.5-.1 3.5 1.7v.3l-3.5 3z" fill="#FBBC04" />
                  <path d="M6 9.8V4.8C4.6 3.7 2.5 4.7 2.5 6.5v.3L6 9.8z" fill="#C5221F" />
                </svg>
              </button>

              {/* TikTok — Official Original Black Badge with Cyan (#25F4EE), Red (#FE2C55) & White Glitch Note */}
              <a
                href={owner.tiktok}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#000000] border border-white/15 shadow-sm hover:scale-105 transition-all"
                aria-label="TikTok"
                title={`TikTok: ${owner.tiktokHandle}`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {/* Cyan Glitch Layer */}
                  <path
                    d="M11.7 1.2c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                    fill="#25F4EE"
                    transform="translate(-0.9, -0.7)"
                  />
                  {/* Red/Pink Glitch Layer */}
                  <path
                    d="M13.3 1.2c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                    fill="#FE2C55"
                    transform="translate(0.9, 0.7)"
                  />
                  {/* Center White Layer */}
                  <path
                    d="M12.5 1.2c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                    fill="#FFFFFF"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
