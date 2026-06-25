interface LogoProps {
  className?: string;
  textColor?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", textColor = "text-white", size = "md" }: LogoProps) {
  const imgSizes = { sm: "h-7", md: "h-9", lg: "h-12" };
  const nameSizes = { sm: "text-[12px]", md: "text-[14px]", lg: "text-[18px]" };
  const subSizes = { sm: "text-[8px]", md: "text-[9px]", lg: "text-[11px]" };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/WhatsApp_Image_2026-05-21_at_3.08.26_PM.jpeg"
        alt="E Style Collection"
        className={`${imgSizes[size]} w-auto object-contain flex-shrink-0 drop-shadow-sm`}
      />
      <div className="flex flex-col leading-tight">
        <span className={`font-display font-bold tracking-[0.12em] uppercase ${nameSizes[size]} ${textColor}`}>
          E Style
        </span>
        <span className={`tracking-[0.28em] uppercase font-semibold ${subSizes[size]} text-amber-400`}>
          Collection
        </span>
      </div>
    </div>
  );
}
