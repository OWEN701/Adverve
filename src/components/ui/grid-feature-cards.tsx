import React from 'react';

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export type FeatureType = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
};

type FeatureCardProps = React.ComponentProps<'div'> & {
  feature: FeatureType;
};

/**
 * Grid of dashed-bordered feature cards, each with a faint animated grid
 * pattern bleeding from the top.
 *
 * Adapted from the source: local `cn` (the project has no `@/lib/utils`), and
 * the shadcn `foreground` / `muted-foreground` tokens retargeted to the
 * slate / cyan palette.
 */
export function FeatureCard({ feature, className, ...props }: FeatureCardProps) {
  const p = genRandomPattern();

  return (
    <div className={cn('relative overflow-hidden p-6', className)} {...props}>
      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/[0.06] to-cyan-400/0 opacity-100 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
          <GridPattern
            width={20}
            height={20}
            x="-12"
            y="4"
            squares={p}
            className="absolute inset-0 h-full w-full fill-cyan-400/[0.05] stroke-cyan-400/20 mix-blend-overlay"
          />
        </div>
      </div>
      <feature.icon className="size-6 text-cyan-400/80" strokeWidth={1} aria-hidden />
      <h3 className="mt-10 text-sm font-semibold text-white md:text-base">{feature.title}</h3>
      <p className="relative z-20 mt-2 text-xs font-light text-slate-400 md:text-sm">{feature.description}</p>
    </div>
  );
}

/** The dashed grid that lays the cards out (1 / 2 / 3 columns). */
export function FeatureGrid({
  features,
  className,
  columns = 3,
}: {
  features: FeatureType[];
  className?: string;
  columns?: 2 | 3;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 divide-x divide-y divide-dashed divide-white/10 border border-dashed border-white/10',
        columns === 3 ? 'sm:grid-cols-2 md:grid-cols-3' : 'sm:grid-cols-2',
        className,
      )}
    >
      {features.map((feature) => (
        <FeatureCard key={feature.title} feature={feature} />
      ))}
    </div>
  );
}

function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: React.ComponentProps<'svg'> & {
  width: number;
  height: number;
  x: string;
  y: string;
  squares?: number[][];
}) {
  const patternId = React.useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([sx, sy], index) => (
            <rect strokeWidth="0" key={index} width={width + 1} height={height + 1} x={sx * width} y={sy * height} />
          ))}
        </svg>
      )}
    </svg>
  );
}

function genRandomPattern(length?: number): number[][] {
  length = length ?? 5;
  return Array.from({ length }, () => [
    Math.floor(Math.random() * 4) + 7, // random x between 7 and 10
    Math.floor(Math.random() * 6) + 1, // random y between 1 and 6
  ]);
}
