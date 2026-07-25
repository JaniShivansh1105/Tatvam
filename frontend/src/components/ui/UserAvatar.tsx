"use client";

import React, { useMemo } from "react";

interface UserAvatarProps {
  name?: string | null;
  email?: string | null;
  userId?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const COLOR_PALETTES = [
  ["#6C5CE7", "#8B7CF6", "#00C6FF"],
  ["#FF5E62", "#FF9966", "#FFD166"],
  ["#00F2FE", "#4FACFE", "#00C6FF"],
  ["#11998E", "#38EF7D", "#A8FF78"],
  ["#8E2DE2", "#4A00E0", "#C77DFF"],
  ["#FF007A", "#7928CA", "#FF4D4D"],
  ["#F2994A", "#F2C94C", "#FFD166"],
  ["#2F80ED", "#56CCF2", "#80D0C7"],
];

const SIZE_MAP = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-[12px]",
  md: "w-10 h-10 text-[14px]",
  lg: "w-14 h-14 text-[18px]",
  xl: "w-20 h-20 text-[24px]",
  "2xl": "w-28 h-28 text-[32px]",
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function UserAvatar({ name, email, userId, size = "md", className = "" }: UserAvatarProps) {
  const seed = name || userId || email || "tatvam-user";

  const avatarData = useMemo(() => {
    const hash = hashString(seed);
    const paletteIndex = hash % COLOR_PALETTES.length;
    const colors = COLOR_PALETTES[paletteIndex];

    const angle = (hash % 360);
    const cx1 = 20 + (hash % 60);
    const cy1 = 20 + ((hash >> 2) % 60);
    const r1 = 25 + ((hash >> 4) % 30);
    const cx2 = 60 + ((hash >> 3) % 40);
    const cy2 = 60 + ((hash >> 5) % 40);
    const r2 = 20 + ((hash >> 6) % 25);

    const initial = (name || email || "U").trim().charAt(0).toUpperCase();

    return {
      colors,
      angle,
      cx1, cy1, r1,
      cx2, cy2, r2,
      initial,
      hashId: `avatar-grad-${hash}`,
    };
  }, [seed, name, email]);

  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div className={`relative rounded-full overflow-hidden shrink-0 shadow-sm border border-white/40 select-none ${sizeClasses} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id={avatarData.hashId} x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform={`rotate(${avatarData.angle})`}>
            <stop offset="0%" stopColor={avatarData.colors[0]} />
            <stop offset="50%" stopColor={avatarData.colors[1]} />
            <stop offset="100%" stopColor={avatarData.colors[2]} />
          </linearGradient>
        </defs>

        {/* Base Background Gradient */}
        <rect width="100" height="100" fill={`url(#${avatarData.hashId})`} />

        {/* Geometric Abstract Overlay Shapes */}
        <circle cx={avatarData.cx1} cy={avatarData.cy1} r={avatarData.r1} fill="white" fillOpacity="0.25" />
        <circle cx={avatarData.cx2} cy={avatarData.cy2} r={avatarData.r2} fill={avatarData.colors[2]} fillOpacity="0.4" />
        
        {/* Subtle Inner Ring */}
        <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.3" />

        {/* Letter Mark */}
        <text
          x="50"
          y="56"
          dominantBaseline="central"
          textAnchor="middle"
          fill="white"
          fontSize="42"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
        >
          {avatarData.initial}
        </text>
      </svg>
    </div>
  );
}
