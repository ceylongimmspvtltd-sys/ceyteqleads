import Image from "next/image";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <a href="/business-enquiry" aria-label="CEYTEQ — Empowering Digital Evolution" className="inline-flex shrink-0 items-center">
      <Image
        src="/ceyteq-logo.jpg"
        alt="CEYTEQ — Empowering Digital Evolution"
        width={compact ? 174 : 206}
        height={compact ? 98 : 116}
        priority
        className={compact ? "h-[74px] w-[132px] object-contain" : "h-[88px] w-[160px] object-contain sm:h-[96px] sm:w-[184px]"}
      />
    </a>
  );
}
