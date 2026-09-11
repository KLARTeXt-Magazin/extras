import type { CSSProperties, ReactNode } from "react";

type LiquidGlassProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  intensity?: "soft" | "medium" | "strong";
};

let liquidGlassId = 0;

function createFilterId() {
  liquidGlassId += 1;
  return `liquid-glass-filter-${liquidGlassId}`;
}

export function LiquidGlass({
  children,
  className = "",
  style,
  intensity = "medium",
}: LiquidGlassProps) {
  const filterId = createFilterId();

  const displacementScale = {
    soft: 7,
    medium: 12,
    strong: 24,
  }[intensity];

  const blur = {
    soft: 14,
    medium: 20,
    strong: 26,
  }[intensity];

  return (
    <>
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        className="pointer-events-none absolute"
        style={{ position: "absolute" }}
      >
        <defs>
          <filter
            id={filterId}
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.025"
              numOctaves="2"
              seed="17"
              result="noise"
            />

            <feGaussianBlur
              in="noise"
              stdDeviation="1.15"
              result="softNoise"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="softNoise"
              scale={displacementScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />

            <feGaussianBlur
              in="displaced"
              stdDeviation={blur / 10}
              result="refracted"
            />

            <feColorMatrix
              in="refracted"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.96 0
              "
            />
          </filter>
        </defs>
      </svg>

      <div
        className={`liquid-glass ${className}`}
        style={{
          ...style,
          "--liquid-filter": `url(#${filterId})`,
          "--liquid-blur": `${blur}px`,
        } as CSSProperties}
      >
        <div className="liquid-glass-content">{children}</div>
      </div>
    </>
  );
}
