import { cn } from "@/lib/utils";

interface ProductIconProps {
  src: string;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: 12,
  sm: 40,
  md: 48,
  lg: 56,
  xl: 72,
} as const;

export function ProductIcon({
  src,
  alt,
  size = "md",
  className,
}: ProductIconProps) {
  const dim = sizeMap[size];

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: dim, height: dim }}
    >
      <img
        src={src}
        alt={alt}
        width={dim}
        height={dim}
        className="block h-full w-full object-contain"
      />
    </div>
  );
}
