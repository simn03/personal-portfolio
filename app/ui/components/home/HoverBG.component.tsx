"use client";

type HoverBGProps = {
  className?: string;
  isVisible: boolean;
  x: number;
  y: number;
};

export default function HoverBG({ className, isVisible, x, y }: HoverBGProps) {
  const radius = 10;

  return (
    <div
      className={`${className ?? ""} ${
        isVisible ? "opacity-30 animate-ripple" : "opacity-0"
      } -z-10 fixed overflow-hidden rounded-full bg-gradient-radial to-transparent from-primary`}
      style={{
        left: x - radius / 2,
        top: y - radius / 2,
        width: radius,
        height: radius,
      }}
      aria-hidden="true"
    />
  );
}
