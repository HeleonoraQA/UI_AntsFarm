import { useId } from "react";
import type { Ant } from "@/lib/ant-farm";

type StaticAntType = "soldier" | "worker";

type StaticAntProps = {
  type: StaticAntType;
  className?: string;
  style?: React.CSSProperties;
};

export function StaticAnt({ type, className, style }: StaticAntProps) {
  const isSoldier = type === "soldier";
  const id = useId();
  const shadowGradientId = `${id}-shadow`;
  const darkBodyGradientId = `${id}-dark-body`;
  const midBodyGradientId = `${id}-mid-body`;
  const bodyGradientId = `${id}-body`;

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 120 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={isSoldier ? "Солдат" : "Рабочий"}
    >
      <title>{isSoldier ? "Солдат" : "Рабочий"}</title>

      <defs>
        <linearGradient id={shadowGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#92400E" />
          <stop offset="1" stopColor="#451A03" />
        </linearGradient>
        <linearGradient id={darkBodyGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#92400E" />
          <stop offset="1" stopColor="#451A03" />
        </linearGradient>
        <linearGradient id={midBodyGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#B45309" />
          <stop offset="1" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id={bodyGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#D97706" />
          <stop offset="1" stopColor="#92400E" />
        </linearGradient>
      </defs>

      <ellipse cx="60" cy="78" rx="34" ry="4" fill={`url(#${shadowGradientId})`} opacity="0.35" />

      {/* Far legs */}
      <g stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" opacity="0.65">
        <path d="M50 54 Q 40 61 32 59" />
        <path d="M57 56 Q 51 68 45 72" />
        <path d="M64 56 Q 69 68 73 73" />
      </g>

      {/* Near legs */}
      <g stroke="#9A3412" strokeWidth="3" strokeLinecap="round">
        <path d="M47 55 Q 35 66 25 68" />
        <path d="M55 58 Q 46 74 38 78" />
        <path d="M63 58 Q 62 74 58 78" />
      </g>

      {/* Antennae */}
      <g stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round">
        <path d="M20 37 Q 11 27 4 29" />
        <path d="M24 34 Q 18 21 10 19" />
      </g>
      <circle cx="4" cy="29" r="2" fill="#FBBF24" />
      <circle cx="10" cy="19" r="2" fill="#FBBF24" />

      {/* Body */}
      <ellipse cx="94" cy="55" rx="19" ry="13" fill={`url(#${darkBodyGradientId})`} />
      <ellipse cx="94" cy="52" rx="13" ry="7" fill={`url(#${midBodyGradientId})`} opacity="0.7" />
      <circle cx="73" cy="54" r="4.5" fill={`url(#${darkBodyGradientId})`} />
      <ellipse cx="56" cy="54" rx="14" ry="10" fill={`url(#${bodyGradientId})`} />
      <circle cx="28" cy="47" r="13" fill={`url(#${bodyGradientId})`} />

      {/* Face */}
      <circle cx="22" cy="44" r="2.5" fill="#1C1917" />
      <circle cx="22.7" cy="43.3" r="0.8" fill="#FFFFFF" />
      <path d="M17 53 Q 13 55 15 59" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 49 Q 12 50 11 54" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />

      {isSoldier ? (
        <g>
          <path
            d="M14 41 Q 15 26 28 25 Q 41 26 42 41 Z"
            fill="#64748B"
            stroke="#475569"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M12 41 H 44" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
          <path d="M28 26 V 41" stroke="#94A3B8" strokeWidth="1.5" opacity="0.7" />
          <circle cx="34" cy="34" r="2" fill="#F59E0B" />
        </g>
      ) : (
        <path
          d="M19 40 Q 23 36 28 36 Q 33 36 37 40"
          stroke="#92400E"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
      )}
    </svg>
  );
}

export function StaticAntColony({
  soldiers,
  workers,
}: {
  soldiers: Ant[];
  workers: Ant[];
}) {
  const ants = [
    ...soldiers.map((ant) => ({ ant, type: "soldier" as const })),
    ...workers.map((ant) => ({ ant, type: "worker" as const })),
  ];

  return (
    <div className="flex flex-wrap items-end gap-x-1 gap-y-0">
      {ants.map(({ ant, type }, index) => (
        <StaticAnt
          key={ant.id}
          type={type}
          className="ant-march h-10 w-auto sm:h-12"
          style={{ animationDelay: `${index * 0.12}s` }}
        />
      ))}
    </div>
  );
}
